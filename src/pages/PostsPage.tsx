import { useEffect, useState } from "react";
import { 
  Card, CardHeader, CardBody, CardFooter, Divider, Chip, Spinner,
  Modal, ModalContent, ModalHeader, ModalBody, useDisclosure 
} from "@heroui/react";
import type { Post } from "../components/AuthContext";
import { CommentSection } from "../components/CommentSection"; // Import du nouveau composant

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  // État pour les commentaires et le modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then(async (data) => {
        setPosts(data.posts);
        const userIds = [...new Set(data.posts.map((p: any) => p.userId))];
        const authorPromises = userIds.map(id => 
          fetch(`https://dummyjson.com/users/${id}?select=firstName,lastName`).then(res => res.json())
        );
        const authorsData = await Promise.all(authorPromises);
        const authorsMap: Record<number, string> = {};
        authorsData.forEach((u: any) => { authorsMap[u.id] = `${u.firstName} ${u.lastName}`; });
        setAuthors(authorsMap);
        setLoading(false);
      });
  }, []);

  // Fonction déclenchée au clic sur un post
  const openComments = (post: Post) => {
    setSelectedPost(post);
    setLoadingComments(true);
    onOpen(); // Ouvre le modal

    fetch(`https://dummyjson.com/posts/${post.id}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data.comments);
        setLoadingComments(false);
      })
      .catch(() => setLoadingComments(false));
  };

  if (loading) return <div className="flex h-96 justify-center items-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black italic uppercase">Flux Communautaire</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card 
            isPressable // Rend toute la carte cliquable
            onPress={() => openComments(post)}
            key={post.id} 
            className="border-none bg-default-50 hover:bg-default-100 transition-all"
          >
            <CardHeader className="flex flex-col items-start gap-1 p-5">
              <p className="text-md font-bold text-primary line-clamp-1">{post.title}</p>
              <p className="text-[11px] text-default-400">Par : <span className="font-bold text-secondary">{authors[post.userId]}</span></p>
            </CardHeader>
            <Divider />
            <CardBody className="py-5 px-5 h-[120px]">
              <p className="text-default-600 text-sm line-clamp-3 italic">"{post.body}"</p>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between items-center px-5 py-3">
               <div className="flex gap-3">
                <span className="text-xs font-bold text-success">👍 {post.reactions?.likes}</span>
                <span className="text-xs font-bold text-danger">👎 {post.reactions?.dislikes}</span>
              </div>
              <p className="text-[10px] font-bold text-primary italic">Cliquez pour voir les avis</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* --- MODAL DES COMMENTAIRES --- */}
      <Modal 
  isOpen={isOpen} 
  onOpenChange={onOpenChange} 
  scrollBehavior="inside"
  size="lg"
  backdrop="blur"
>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1 border-b pb-4">
          <p className="text-xs text-primary font-bold uppercase tracking-widest">Détails de la publication</p>
          <h2 className="text-xl font-black leading-tight italic uppercase">
            {selectedPost?.title}
          </h2>
        </ModalHeader>
        <ModalBody>
          <CommentSection 
            comments={comments} 
            isLoading={loadingComments} 
            post={selectedPost} // Passage du post
            authorName={selectedPost ? authors[selectedPost.userId] : ""} // Passage du nom de l'auteur
          />
        </ModalBody>
      </>
    )}
  </ModalContent>
</Modal>
    </div>
  );
}