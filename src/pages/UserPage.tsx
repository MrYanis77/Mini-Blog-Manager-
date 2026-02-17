import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Card, CardBody, 
  Button, Input, Textarea, 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Spinner 
} from "@heroui/react";
import type { Post } from "../components/AuthContext";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la gestion du formulaire (Ajout/Modif)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({ title: "", body: "" });
  const [isEditing, setIsEditing] = useState(false);

  // 1. Charger les posts de l'utilisateur
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, [id]);

  // 2. Supprimer un post (Simulation)
  const handleDelete = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  // 3. Ouvrir le modal pour ajouter ou modifier
  const openModal = (post?: Post) => {
    if (post) {
      setCurrentPost(post);
      setIsEditing(true);
    } else {
      setCurrentPost({ title: "", body: "", userId: Number(id) });
      setIsEditing(false);
    }
    onOpen();
  };

  // 4. Enregistrer (Ajout ou Modif)
  const handleSave = () => {
    if (isEditing) {
      setPosts(posts.map(p => p.id === currentPost.id ? (currentPost as Post) : p));
    } else {
      const newPost = { ...currentPost, id: Date.now() } as Post;
      setPosts([newPost, ...posts]);
    }
    onClose();
  };

  if (loading) return <div className="flex justify-center p-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black italic">POSTS DE L'AUTEUR #{id}</h1>
          <p className="text-default-400">Gérez vos publications ci-dessous.</p>
        </div>
        <Button color="primary" onPress={() => openModal()} className="font-bold">
          + Nouveau Post
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="border-none bg-default-50">
            <CardBody className="flex flex-row justify-between items-center p-6">
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-lg capitalize">{post.title}</h3>
                <p className="text-default-500 text-sm line-clamp-2">{post.body}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="flat" onPress={() => openModal(post)}>Modifier</Button>
                <Button size="sm" variant="flat" color="danger" onPress={() => handleDelete(post.id)}>Supprimer</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* --- Modal Formulaire --- */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditing ? "Modifier le post" : "Nouvel article"}
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Titre"
                  placeholder="Titre de l'article"
                  variant="bordered"
                  value={currentPost.title}
                  onValueChange={(val) => setCurrentPost({ ...currentPost, title: val })}
                />
                <Textarea
                  label="Contenu"
                  placeholder="Écrivez votre texte ici..."
                  variant="bordered"
                  value={currentPost.body}
                  onValueChange={(val) => setCurrentPost({ ...currentPost, body: val })}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Annuler</Button>
                <Button color="primary" onPress={handleSave}>Enregistrer</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}