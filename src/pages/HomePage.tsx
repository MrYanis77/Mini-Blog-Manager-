import { 
  Card, 
  CardBody, 
  CardFooter, 
  Image, 
  Button, 
  Chip, 
  User, 
  Input,
  Listbox,
  ListboxItem
} from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  // Tes catégories principales simplifiées
  const mainCategories = [
    { key: "recipes", label: "Recettes", desc: "Plats et gourmandises", color: "text-orange-500" },
    { key: "evasion", label: "Évasion", desc: "Voyage et mystère", color: "text-blue-500" },
    { key: "inspiration", label: "Inspiration", desc: "Nature et aventure", color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- SIDEBAR GAUCHE --- */}
        <aside className="lg:col-span-3">
          <div className="sticky top-12 space-y-10">
            
            {/* 1. Catégories Principales */}
            <div>
              <h2 className="text-xl font-black mb-4 tracking-tighter italic uppercase opacity-50">Explorer</h2>
              <Listbox 
                aria-label="Catégories"
                variant="flat"
                className="p-0 gap-2"
                onAction={(key) => navigate(`/category/${key}`)}
                itemClasses={{
                  base: "px-4 py-3 rounded-2xl data-[hover=true]:bg-default-100 transition-all",
                  title: "text-lg font-black uppercase italic",
                  description: "text-default-400 font-medium"
                }}
              >
                {mainCategories.map((cat) => (
                  <ListboxItem 
                    key={cat.key} 
                    description={cat.desc}
                    className={cat.color}
                  >
                    {cat.label}
                  </ListboxItem>
                ))}
              </Listbox>
            </div>

            {/* 2. Newsletter */}
            <Card className="bg-primary text-primary-foreground p-2 border-none shadow-xl shadow-primary/20" shadow="none">
              <CardBody className="gap-4">
                <div className="space-y-1">
                  <p className="font-black uppercase italic text-xl leading-none">Hebdo Mag</p>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Le meilleur du blog</p>
                </div>
                <Input 
                  size="sm" 
                  placeholder="Ton email..." 
                  variant="flat" 
                  className="bg-white/10 rounded-xl"
                  classNames={{ input: "placeholder:text-white/50 text-white" }}
                />
                <Button size="md" className="bg-white text-primary font-black uppercase italic">
                  S'abonner
                </Button>
              </CardBody>
            </Card>
          </div>
        </aside>

        {/* --- FLUX PRINCIPAL --- */}
        <div className="lg:col-span-9 space-y-12">
          
          {/* Article à la une */}
          <section>
            <Card 
              className="w-full h-[500px] border-none group overflow-hidden rounded-[40px]" 
              isPressable
              onPress={() => navigate('/category/recipes')}
            >
              <Image
                removeWrapper
                alt="Main post"
                className="z-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000"
              />
              <CardFooter className="absolute bottom-0 z-10 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-t border-divider p-8 justify-between flex-col items-start translate-y-2 group-hover:translate-y-0 transition-transform">
                <Chip size="sm" color="warning" className="mb-4 font-black uppercase italic px-4 text-white">À la une</Chip>
                <h3 className="text-3xl md:text-4xl font-black mb-4 text-left leading-none uppercase italic tracking-tighter">
                  Le secret des pâtes fraîches : La recette de la Nonna
                </h3>
                <div className="flex justify-between w-full items-center">
                  <User 
                    name={<span className="font-bold uppercase italic">Chef Marco</span>}
                    description="Gastronomie Italienne" 
                    avatarProps={{ src: "https://i.pravatar.cc/150?u=chef", className: "w-10 h-10" }}
                  />
                  <span className="text-xs font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                    Voir la recette
                  </span>
                </div>
              </CardFooter>
            </Card>
          </section>

          {/* Grille d'articles */}
          <section>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Dernières pépites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <BlogCard 
                tag="Mysterious" 
                title="Les secrets enfouis du vieux Paris" 
                img="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800"
                category="evasion"
              />
              <BlogCard 
                tag="Adventure" 
                title="Seul face à la nature sauvage" 
                img="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
                category="inspiration"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const BlogCard = ({ tag, title, img, category }: { tag: string; title: string; img: string; category: string }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="border-none bg-transparent shadow-none group cursor-pointer"
      isPressable
      onPress={() => navigate(`/category/${category}`)}
    >
      <div className="relative overflow-hidden rounded-[32px] mb-6">
        <Image 
          src={img} 
          alt={title} 
          className="w-full aspect-[16/10] object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 z-20">
          <Chip className="font-black uppercase italic bg-white/90 text-black border-none shadow-lg" size="sm">
            {tag}
          </Chip>
        </div>
      </div>
      <h4 className="text-2xl font-black leading-tight uppercase italic tracking-tighter group-hover:text-primary transition-colors">
        {title}
      </h4>
      <div className="flex items-center gap-3 mt-4">
        <div className="w-8 h-[2px] bg-primary" />
        <p className="text-default-400 text-[10px] font-black uppercase tracking-widest italic">
          Lire la suite →
        </p>
      </div>
    </Card>
  );
};