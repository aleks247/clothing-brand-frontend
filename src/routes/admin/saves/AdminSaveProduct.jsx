import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { get, post, put } from "../../../utils/request";
import styles from "./../Admin.module.css";

export default function AdminSaveProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [name, setName] = useState("");
    const [imagesStr, setImagesStr] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [tag, setTag] = useState("");
    const [colorsStr, setColorsStr] = useState("");
    const [desc, setDesc] = useState("");

    const [previewIndex, setPreviewIndex] = useState(0);

    useEffect(() => {
        if (!isEditMode) return;

        const load = async () => {
            setLoading(true);
            try {
                const data = await get(`http://localhost:3030/jsonstore/products/${id}`);
                setName(data.name || "");
                const imgs = Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []);
                setImagesStr(imgs.join(", "));
                setPrice(data.price || "");
                setCategory(data.category || "");
                setBrand(data.brand || "");
                setTag(data.tag || "");
                const cols = Array.isArray(data.colors) ? data.colors : [];
                setColorsStr(cols.join(", "));
                setDesc(data.desc || "");
            } catch (err) {
                setError(err.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, isEditMode]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const images = imagesStr.split(",").map((s) => s.trim()).filter(Boolean);
        const colors = colorsStr.split(",").map((s) => s.trim()).filter(Boolean);

        const data = {
            name,
            images,
            price: Number(price) || 0,
            category,
            brand,
            tag,
            colors,
            desc,
        };

        try {
            if (isEditMode) {
                await put(`http://localhost:3030/jsonstore/products/${id}`, data);
            } else {
                await post("http://localhost:3030/jsonstore/products", data);
            }
            navigate("/admin");
        } catch (err) {
            alert(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles['container']}>Loading...</div>;
    if (error) return <div className={styles['container']} style={{ color: "red" }}>{error}</div>;

    const previewImages = imagesStr.split(",").map(s => s.trim()).filter(Boolean);
    const activeImage = previewImages[previewIndex] || previewImages[0] || "https://via.placeholder.com/300?text=No+Image";
    const previewColors = colorsStr.split(",").map(c => c.trim()).filter(Boolean);
    const inputColorChips = colorsStr.split(",").map(c => c.trim()).filter(Boolean);

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <h1 className={styles['title']}>{isEditMode ? "Edit Product" : "Create Product"}</h1>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'flex-start' }}>
                <div style={{ flex: '1', minWidth: '300px', position: 'sticky', top: '20px' }}>
                    <h3 style={{ marginBottom: '15px', color: '#888', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Preview
                    </h3>
                    
                    <div style={{ 
                        border: '1px solid #EAEAEA', 
                        borderRadius: '16px', 
                        padding: '20px', 
                        background: '#FFF',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ 
                            width: '100%', 
                            aspectRatio: '3/4', 
                            background: '#F4F4F4', 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            marginBottom: '15px',
                            position: 'relative',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                        }}>
                            {tag && (
                                <span style={{ 
                                    position: 'absolute', top: '10px', left: '10px', 
                                    background: 'white', padding: '4px 10px', 
                                    fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', borderRadius: '4px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}>
                                    {tag}
                                </span>
                            )}
                            
                            {previewImages.length > 0 ? (
                                <img 
                                    src={activeImage} 
                                    alt="Preview" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => e.target.style.opacity = 0.5} 
                                />
                            ) : (
                                <span style={{color: '#CCC', fontSize: '14px'}}>Image Preview</span>
                            )}
                        </div>

                        {previewImages.length > 1 && (
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '5px' }}>
                                {previewImages.map((img, idx) => (
                                    <img 
                                        key={idx}
                                        src={img}
                                        alt={`Thumbnail ${idx}`}
                                        onClick={() => setPreviewIndex(idx)}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '6px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            border: idx === previewIndex ? '2px solid #222' : '1px solid #eee',
                                            opacity: idx === previewIndex ? 1 : 0.6
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        <div>
                            <h3 style={{ fontSize: '18px', margin: '0 0 5px 0', color: name ? '#222' : '#CCC' }}>
                                {name || "Product Name"}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#888', margin: '0 0 15px 0', lineHeight: '1.4' }}>
                                {desc ? (desc.length > 80 ? desc.substring(0, 80) + "..." : desc) : "Description will appear here..."}
                            </p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '18px', fontWeight: '700', color: price ? '#222' : '#CCC' }}>
                                    ${Number(price).toFixed(2)}
                                </span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {previewColors.length > 0 ? previewColors.map((c, i) => (
                                        <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '1px solid #ddd' }}></div>
                                    )) : <span style={{ fontSize: '12px', color: '#ccc' }}>Colors</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit} className={styles['form']} style={{ flex: '2', minWidth: '300px' }}>
                    <div className={styles['inputGroup']}>
                        <label className={styles['label']}>Name</label>
                        <input className={styles['input']} value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className={styles['inputGroup']}>
                        <label className={styles['label']}>Images (comma separated URLs)</label>
                        <input className={styles['input']} value={imagesStr} onChange={(e) => setImagesStr(e.target.value)} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className={styles['inputGroup']}>
                            <label className={styles['label']}>Brand</label>
                            <input className={styles['input']} value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </div>
                        <div className={styles['inputGroup']}>
                            <label className={styles['label']}>Tag</label>
                            <input className={styles['input']} value={tag} onChange={(e) => setTag(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className={styles['inputGroup']}>
                            <label className={styles['label']}>Price</label>
                            <input className={styles['input']} type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} min={0} required />
                        </div>
                        <div className={styles['inputGroup']}>
                            <label className={styles['label']}>Category</label>
                            <input className={styles['input']} value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles['inputGroup']}>
                        <label className={styles['label']}>Colors (comma separated hex or names)</label>
                        <input className={styles['input']} value={colorsStr} onChange={(e) => setColorsStr(e.target.value)} />
                        
                        {inputColorChips.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                                {inputColorChips.map((c, i) => (
                                    <div key={i} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '6px', 
                                        padding: '4px 10px', background: '#F5F5F5', 
                                        borderRadius: '20px', fontSize: '12px', color: '#555', border: '1px solid #EAEAEA'
                                    }}>
                                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c, border: '1px solid #DDD' }}></span>
                                        {c}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles['inputGroup']}>
                        <label className={styles['label']}>Description</label>
                        <textarea className={styles['textarea']} value={desc} onChange={(e) => setDesc(e.target.value)} />
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', gap: '15px' }}>
                        <button className={styles['primaryBtn']} type="submit" disabled={saving}>
                            {saving ? "Saving..." : (isEditMode ? "Save Changes" : "Create Product")}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin')} 
                            style={{ 
                                background: 'none', border: 'none', cursor: 'pointer', 
                                color: '#666', fontWeight: '600', padding: '10px 20px'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}