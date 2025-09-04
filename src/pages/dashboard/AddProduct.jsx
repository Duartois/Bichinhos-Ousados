// src/pages/dashboard/AddProduct.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Save, ImagePlus, CheckCircle, Scissors } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const MAX_IMAGES = 8;

function toNumberLikeBR(v) {
  if (v == null) return "";
  const s = String(v).trim();
  if (!s) return "";
  const normalized = s.replace(/\./g, "").replace(",", ".");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : "";
}

function toStrNumber(v) {
  if (v === "" || v == null) return "";
  return String(v);
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { id: idFromPath } = useParams();
  const id = useMemo(() => searchParams.get("id") || idFromPath || null, [searchParams, idFromPath]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);
  const cropperRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    type: "Personalizáveis",
    price: "",
    oldPrice: "",
    savePrice: "",
    shortDes: "",
    detail: "",
    tags: "",
  });

  const [images, setImages] = useState([]);
  const hasUser = !!user?.email;

  const onConfirmCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas({ width: 800, height: 800 });
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `cropped-${Date.now()}.jpeg`, { type: "image/jpeg" });
        setImages((imgs) => [file, ...imgs.slice(1)]);
        setCropSrc(null);
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await api.get(`/product-data?id=${encodeURIComponent(id)}`);
        setForm({
          name: data.name || "",
          category: data.category || "",
          type: data.type || "Tipo",
          price: toNumberLikeBR(data.price),
          oldPrice: toNumberLikeBR(data.oldPrice),
          savePrice: toNumberLikeBR(data.savePrice),
          shortDes: data.shortDes || "",
          detail: data.detail || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
        });

        const arr = [];
        if (data.image) arr.push(data.image);
        if (Array.isArray(data.images)) {
          data.images.forEach((u) => {
            if (u && !arr.includes(u)) arr.push(u);
          });
        }
        setImages(arr.slice(0, MAX_IMAGES));
      } catch (e) {
        console.error("Erro ao buscar produto:", e);
        alert("Não foi possível carregar o produto para edição.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((old) => {
      const available = MAX_IMAGES - old.length;
      const pick = files.slice(0, available);
      return old.concat(pick);
    });
    e.target.value = "";
  };

  const setMainImage = (index) => {
    if (index === 0) return;
    setImages((arr) => {
      const copy = arr.slice();
      [copy[0], copy[index]] = [copy[index], copy[0]];
      return copy;
    });
  };

  const removeImage = (index) => {
    setImages((arr) => {
      const copy = arr.slice();
      copy.splice(index, 1);
      return copy;
    });
  };

  function validateForPublish(data) {
    if (!data.name) return "Nome é obrigatório";
    if (!data.category) return "Categoria é obrigatória";
    if (data.price === "") return "Preço é obrigatório e deve ser válido";
    if (!images.length) return "Adicione ao menos uma imagem principal";
    return null;
  }

  async function handleSubmit(draft = false) {
    if (!hasUser) {
      alert("Sua sessão expirou. Faça login novamente.");
      navigate("/login");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      type: form.type.trim(),
      shortDes: form.shortDes.trim(),
      detail: form.detail.trim(),
      price: toStrNumber(toNumberLikeBR(form.price)),
      oldPrice: toStrNumber(toNumberLikeBR(form.oldPrice)),
      savePrice: toStrNumber(toNumberLikeBR(form.savePrice)),
      email: user.email,
      draft,
      createdAt: new Date().toISOString(),
      salesCount: 0,
      tags: uniq(
        form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      ),
      image: "",
      images: [],
    };

    if (!draft) {
      const err = validateForPublish(payload);
      if (err) return alert(err);
    }
    if (payload.savePrice && !payload.oldPrice) {
      return alert("Se informar desconto (savePrice), informe também o preço antigo (oldPrice).");
    }

    setSaving(true);
    try {
      const uploaded = [];
      for (const item of images) {
        if (typeof item === "string") {
          uploaded.push(item);
        } else {
          const extFromType = (item.type || "").split("/")[1] || "jpeg";
          const fileType = `image/${extFromType === "jpg" ? "jpeg" : extFromType}`;
          const { data } = await api.get(`/s3url?fileType=${encodeURIComponent(fileType)}`);
          const putUrl = data?.url;
          if (!putUrl) throw new Error("URL S3 não retornada");

          const put = await fetch(putUrl, {
            method: "PUT",
            headers: { "Content-Type": fileType },
            body: item,
          });
          if (!put.ok) throw new Error("Falha no upload S3");

          uploaded.push(putUrl.split("?")[0]);
        }
      }
      payload.image = uploaded[0] || "";
      payload.images = uploaded;

      if (id) payload.id = id;

      const res = await api.post("/add-product", payload);
      if (res.data?.success) {
        alert("Produto salvo com sucesso!");
        navigate("/dashboard");
      } else {
        alert(res.data?.alert || "Falha ao salvar produto.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar. Verifique as imagens e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p className="text-gray-500 animate-pulse">Carregando produto…</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-10">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            disabled={saving}
            onClick={() => handleSubmit(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-60 justify-center"
          >
            <Save size={16} /> Salvar rascunho
          </button>
          <button
            disabled={saving}
            onClick={() => handleSubmit(false)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--first-color)] text-[var(--dark-color)] hover:bg-[var(--first-color-alt)] disabled:opacity-60 justify-center"
          >
            <CheckCircle size={16} /> {id ? "Atualizar produto" : "Publicar produto"}
          </button>
        </div>
      </div>

      {/* Título */}
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--dark-color)] mb-6 text-center sm:text-left">
        {id ? "Editar produto" : "Adicionar produto"}
      </h1>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagens */}
        <section className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Imagens</label>

          {/* Principal */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
            <div className="absolute top-2 left-2 flex gap-2">
              {images.length > 0 && (
                <button
                  onClick={() =>
                    setCropSrc(typeof images[0] === "string" ? images[0] : URL.createObjectURL(images[0]))
                  }
                  className="px-3 py-1.5 text-sm rounded-md bg-white/90 border hover:bg-white"
                >
                  <Scissors size={16} />
                </button>
              )}
            </div>
            {images[0] ? (
              <img
                src={typeof images[0] === "string" ? images[0] : URL.createObjectURL(images[0])}
                className="w-full h-full object-cover"
                alt="Imagem principal"
              />
            ) : (
              <div className="w-full h-full grid place-content-center text-gray-400">
                <ImagePlus className="mx-auto mb-2" />
                <p>Sem imagem principal</p>
              </div>
            )}
            {cropSrc && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                  <Cropper src={cropSrc} ref={cropperRef} aspectRatio={1} viewMode={1} />
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setCropSrc(null)} className="px-3 py-1 border rounded">
                      Cancelar
                    </button>
                    <button
                      onClick={onConfirmCrop}
                      className="px-3 py-1 bg-[var(--first-color)] text-white rounded"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => openFilePicker()}
                className="px-3 py-1.5 text-sm rounded-md bg-white/90 border hover:bg-white"
              >
                Trocar
              </button>
              {images.length > 0 && (
                <button
                  onClick={() => removeImage(0)}
                  className="px-3 py-1.5 text-sm rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                >
                  Remover
                </button>
              )}
            </div>
          </div>

          {/* Miniaturas */}
          <div className="flex flex-wrap gap-3">
            {images.slice(1).map((item, i) => {
              const idx = i + 1;
              const src = typeof item === "string" ? item : URL.createObjectURL(item);
              return (
                <div
                  key={idx}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg border"
                >
                  <img
                    src={src}
                    alt={`Imagem ${idx}`}
                    className="w-full h-full object-cover cursor-pointer rounded-lg"
                    onClick={() => setMainImage(idx)}
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:bg-red-700"
                    title="Remover"
                    style={{ zIndex: 10 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
            {images.length < MAX_IMAGES && (
              <button
                onClick={openFilePicker}
                className="w-20 h-20 sm:w-24 sm:h-24 grid place-content-center rounded-lg border border-dashed text-gray-500 hover:bg-gray-50"
              >
                <Plus />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            className="hidden"
            onChange={onFilesSelected}
          />
          <p className="text-xs text-gray-500">
            Formatos aceitos: PNG ou JPEG. Máx: {MAX_IMAGES} imagens.
          </p>
        </section>

        {/* Campos */}
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do produto</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Kit's Exclusivos"
              maxLength={80}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <input
                name="type"
                value={form.type}
                onChange={onChange}
                maxLength={60}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <input
                name="category"
                value={form.category}
                onChange={onChange}
                maxLength={32}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                placeholder="Amigurumi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço</label>
              <input
                name="price"
                value={form.price}
                onChange={onChange}
                placeholder="199,90"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço antigo</label>
              <input
                name="oldPrice"
                value={form.oldPrice}
                onChange={onChange}
                placeholder="299,90"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Desconto (%)</label>
              <input
                name="savePrice"
                value={form.savePrice}
                onChange={onChange}
                placeholder="35"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                inputMode="decimal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição curta</label>
            <textarea
              name="shortDes"
              value={form.shortDes}
              onChange={onChange}
              rows={2}
              maxLength={120}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
              placeholder="Um resumo curto e vendedor…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Detalhes</label>
            <textarea
              name="detail"
              value={form.detail}
              onChange={onChange}
              rows={6}
              maxLength={900}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
              placeholder="Detalhes completos… (pode incluir HTML simples)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (separe por vírgula)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={onChange}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
              placeholder="Roupas, Femininas, Vestido"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
