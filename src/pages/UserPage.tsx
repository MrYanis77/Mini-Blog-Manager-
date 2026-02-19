import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Card, CardBody, 
  Button, Input, Textarea, 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Spinner, Chip 
} from "@heroui/react";
import type { Post } from "../components/AuthContext";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Gestion de la Modal
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  
  // États pour le formulaire
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({
    title: "",
    body: "",
    tags: [],
    reactions: { likes: 0, dislikes: 0 }
  });
  const [tagInput, setTagInput] = useState("");

  // 1. Charger les posts de l'utilisateur
  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/posts/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement posts:", err);
        setLoading(false);
      });
  }, [id]);

  // 2. Logique des Hashtags
  const addTag = () => {
    const cleanTag = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (cleanTag && !currentPost.tags?.includes(cleanTag)) {
      setCurrentPost({
        ...currentPost,
        tags: [...(currentPost.tags || []), cleanTag]
      });
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentPost({
      ...currentPost,
      tags: currentPost.tags?.filter(t => t !== tagToRemove)
    });
  };

  // 3. CRUD local (Simulation)
  const openModal = (post?: Post) => {
    if (post) {
      setCurrentPost(post);
      setIsEditing(true);
    } else {
      setCurrentPost({ 
        title: "", 
        body: "", 
        userId: Number(id), 
        tags: [], 
        reactions: { likes: 0, dislikes: 0 } 
      });
      setIsEditing(false);
    }
    onOpen();
  };

  const handleSave = () => {
    if (isEditing) {
      setPosts(posts.map(p => p.id === currentPost.id ? (currentPost as Post) : p));
    } else {
      const newPost = { ...currentPost, id: Date.now() } as Post;
      setPosts([newPost, ...posts]);
    }
    onClose();
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  if (loading) return <div className="flex justify-center p-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase">Publications #{id}</h1>
          <p className="text-default-400 font-medium">{posts.length} articles publiés</p>
        </div>
        <Button 
          color="primary" 
          onPress={() => openModal()} 
          className="font-bold shadow-lg shadow-primary/30"
        >
          + Nouveau Post
        </Button>
      </header>

      {/* --- Liste des Posts --- */}
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-none bg-default-50 shadow-sm">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl capitalize mb-2">{post.title}</h3>
                  <p className="text-default-600 mb-4 leading-relaxed">{post.body}</p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {post.tags?.map(tag => (
                      <Chip key={tag} size="sm" variant="flat" color="primary" className="font-bold">
                        #{tag}
                      </Chip>
                    ))}
                    <div className="flex items-center gap-2 ml-auto">
                      <Chip variant="light" color="success" startContent={<span>👍</span>}>{post.reactions?.likes}</Chip>
                      <Chip variant="light" color="danger" startContent={<span>👎</span>}>{post.reactions?.dislikes}</Chip>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-end">
                  <Button size="sm" variant="flat" onPress={() => openModal(post)}>Modifier</Button>
                  <Button size="sm" variant="flat" color="danger" onPress={() => handleDelete(post.id)}>Supprimer</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* --- Modal d'Édition / Création --- */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl font-bold">
                {isEditing ? "Modifier la publication" : "Créer un nouvel article"}
              </ModalHeader>
              <ModalBody className="gap-6">
                <Input
                  label="Titre"
                  placeholder="Entrez le titre..."
                  variant="bordered"
                  value={currentPost.title}
                  onValueChange={(val) => setCurrentPost({ ...currentPost, title: val })}
                />
                
                <Textarea
                  label="Contenu"
                  placeholder="De quoi voulez-vous parler ?"
                  variant="bordered"
                  minRows={4}
                  value={currentPost.body}
                  onValueChange={(val) => setCurrentPost({ ...currentPost, body: val })}
                />

                <div className="space-y-3">
                  <Input
                    label="Ajouter des hashtags"
                    placeholder="ex: tech, voyage..."
                    variant="bordered"
                    value={tagInput}
                    onValueChange={setTagInput}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    endContent={
                      <Button isIconOnly size="sm" color="primary" variant="flat" onPress={addTag}>+</Button>
                    }
                  />
                  <div className="flex flex-wrap gap-2">
                    {currentPost.tags?.map((tag) => (
                      <Chip key={tag} color="primary" variant="dot" onClose={() => removeTag(tag)}>
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Annuler</Button>
                <Button color="primary" className="font-bold px-8" onPress={handleSave}>
                  {isEditing ? "Mettre à jour" : "Publier"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}