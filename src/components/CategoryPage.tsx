import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Button, Image } from "@heroui/react";
import type { Post, Recipe } from "./AuthContext";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dataList, setDataList] = useState<(Post | Recipe)[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const isRecipeCategory = id === "recipes";

  useEffect(() => {
    setLoading(true);
    setSelectedTag(null); // Reset du filtre quand on change de catégorie
    
    let apiTag = id;
    if (id === "voyage" || id === "evasion") apiTag = "magical";
    if (id === "culture") apiTag = "history";
    if (id === "inspiration") apiTag = "life";

    const fetchUrl = isRecipeCategory 
      ? `https://dummyjson.com/recipes` 
      : `https://dummyjson.com/posts/tag/${apiTag}`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setDataList(isRecipeCategory ? data.recipes : data.posts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isRecipeCategory]);

  // Extraction dynamique des tags uniques pour le filtre latéral
  const availableTags = useMemo(() => {
    if (isRecipeCategory) return [];
    const tags = (dataList as Post[]).flatMap(post => post.tags);
    return Array.from(new Set(tags));
  }, [dataList, isRecipeCategory]);

  // Filtrage de la liste selon le tag sélectionné
  const filteredData = useMemo(() => {
    if (!selectedTag) return dataList;
    return (dataList as Post[]).filter(post => post.tags.includes(selectedTag));
  }, [dataList, selectedTag]);

  if (loading) return (
    <div className="flex h-screen justify-center items-center">
      <Spinner size="lg" color="primary" label="Mise en page..." />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      {/* Navigation et Header */}
      <nav className="mb-8">
        <Button variant="flat" onPress={() => navigate(-1)} className="font-black uppercase italic text-xs">
          ← Retour
        </Button>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* --- SIDEBAR DE FILTRES --- */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-12 space-y-8">
            <header>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter text-primary leading-none mb-2">
                #{id}
              </h1>
              <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest">Explorer la section</p>
            </header>

            {!isRecipeCategory && availableTags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-default-100 pb-2">
                  Filtrer par tag
                </h3>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`text-left px-3 py-1 rounded-full text-[11px] font-black uppercase italic transition-all ${
                      !selectedTag ? "bg-primary text-white" : "bg-default-100 hover:bg-default-200"
                    }`}
                  >
                    Tous les articles
                  </button>
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`text-left px-3 py-1 rounded-full text-[11px] font-black uppercase italic transition-all ${
                        selectedTag === tag ? "bg-primary text-white" : "bg-default-100 hover:bg-default-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* --- FLUX DE CONTENU --- */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {filteredData.map((item) => {
              
              // --- RENDU RECETTE ---
              if (isRecipeCategory) {
                const recipe = item as Recipe;
                return (
                  <article key={recipe.id} className="group cursor-pointer" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                    <div className="relative overflow-hidden rounded-[40px] mb-6 shadow-xl">
                      <Image 
                        src={recipe.image} 
                        alt={recipe.name} 
                        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic leading-none group-hover:text-primary transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-default-400 mt-4 font-bold text-[10px] tracking-widest uppercase">
                      {recipe.cuisine} • {recipe.difficulty}
                    </p>
                  </article>
                );
              }

              // --- RENDU POST ---
              const post = item as Post;
              return (
                <article key={post.id} className="group cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="bg-default-100 aspect-video rounded-[40px] mb-8 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-colors border-2 border-transparent group-hover:border-primary/20">
                      <span className="text-default-200 font-black text-6xl uppercase italic opacity-30 select-none">
                        #{id}
                      </span>
                    </div>

                    <h3 className="text-4xl font-black uppercase italic leading-[0.9] tracking-tighter group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-default-500 mt-6 line-clamp-4 italic font-medium leading-relaxed text-lg">
                      "{post.body}"
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-default-100 flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.map(t => (
                        <span key={t} className={`text-[10px] font-black uppercase ${selectedTag === t ? 'text-primary' : 'text-default-400'}`}>#{t}</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-default-400 uppercase">
                      👍 {post.reactions?.likes} LIKES
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredData.length === 0 && (
            <div className="py-20 text-center text-default-300 font-black uppercase italic text-2xl">
              Aucun article pour ce tag
            </div>
          )}
        </div>
      </div>
    </div>
  );
}