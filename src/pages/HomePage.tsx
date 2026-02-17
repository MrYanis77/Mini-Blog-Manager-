import React from "react";
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

export default function HomePage() {
  const categories = [
    { key: "tech", label: "Tech", desc: "Gadgets et logiciels", color: "bg-default-200" },
    { key: "lifestyle", label: "Lifestyle", desc: "Mode et bien-être", color: "" },
    { key: "gaming", label: "Gaming", desc: "Jeux et consoles", color: "" },
    { key: "voyage", label: "Voyage", desc: "Destinations de rêve", color: "" },
    { key: "cuisine", label: "Cuisine", desc: "Recettes gourmandes", color: "" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- Sidebar Gauche (Inspirée de ton image) --- */}
        <aside className="lg:col-span-3">
          <div className="sticky top-12 space-y-8">
            <div>
              <h2 className="text-2xl font-black mb-6 tracking-tight">EXPLORER</h2>
              <Listbox 
                aria-label="Catégories du blog"
                variant="flat"
                className="p-0 gap-2"
                itemClasses={{
                  base: "px-4 py-3 rounded-xl data-[hover=true]:bg-default-100",
                  title: "text-lg font-bold",
                  description: "text-default-400"
                }}
              >
                {categories.map((cat) => (
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

            {/* Newsletter simplifiée */}
            <Card className="bg-primary text-primary-foreground p-4 border-none" shadow="sm">
              <CardBody className="gap-3">
                <p className="font-bold">Hebdo Mag</p>
                <p className="text-xs opacity-80">Reçois le meilleur du blog chaque lundi.</p>
                <Input size="sm" placeholder="Email..." variant="bordered" className="bg-white/10 rounded-lg" />
                <Button size="sm" className="bg-white text-primary font-bold">S'abonner</Button>
              </CardBody>
            </Card>
          </div>
        </aside>

        {/* --- Flux Principal d'Articles --- */}
        <div className="lg:col-span-9 space-y-12">
          
          {/* Article à la une */}
          <section>
            <Card className="w-full h-[450px] border-none group" isPressable>
              <Image
                removeWrapper
                alt="Main post"
                className="z-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000"
              />
              <CardFooter className="absolute bottom-0 z-10 bg-white/80 dark:bg-black/60 backdrop-blur-md border-t border-divider p-6 justify-between flex-col items-start">
                <Chip size="sm" color="primary" className="mb-2">À la une</Chip>
                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-left">
                  Le futur du Gaming : Entre Cloud et Réalité Augmentée
                </h3>
                <User 
                  name="Marc Tech" 
                  description="Il y a 2 heures" 
                  avatarProps={{ src: "https://i.pravatar.cc/150?u=tech" }}
                />
              </CardFooter>
            </Card>
          </section>

          {/* Grille d'articles */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BlogCard 
              tag="Voyage" 
              title="10 spots secrets au Japon" 
              img="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"
            />
            <BlogCard 
              tag="Cuisine" 
              title="Le secret du Ramen parfait" 
              img="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800"
            />
          </section>
        </div>
      </main>
    </div>
  );
}

/* --- Composant Carte Article --- */
const BlogCard = ({ tag, title, img }: { tag: string; title: string; img: string }) => (
  <Card className="border-none bg-transparent shadow-none group cursor-pointer">
    <div className="relative overflow-hidden rounded-2xl mb-4">
      <Image 
        src={img} 
        alt={title} 
        className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <Chip className="absolute top-3 left-3 z-10 backdrop-blur-md bg-white/20 text-white border-none" size="sm">
        {tag}
      </Chip>
    </div>
    <h4 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
      {title}
    </h4>
    <p className="text-default-400 text-sm mt-2">5 min de lecture • 14 Commentaires</p>
  </Card>
);