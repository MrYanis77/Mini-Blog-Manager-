import { useEffect, useState } from "react";
import { 
  Card, CardHeader, CardBody, CardFooter, Divider, Spinner,
  Modal, ModalContent, ModalHeader, ModalBody, useDisclosure 
} from "@heroui/react";
import type { Post } from "../components/AuthContext";
import { CommentSection } from "../components/CommentSection";

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
        authorsData.forEach((u: any) => { 
          authorsMap[u.id] = `${u.firstName} ${u.lastName}`; 
        });
        setAuthors(authorsMap);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur posts:", err);
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

  if (loading) {
    return (
      <div className="flex h-96 justify-center items-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          Flux Communautaire
        </h1>
        <p className="text-default-400 font-bold uppercase text-xs tracking-widest mt-2">
          Les dernières discussions de la communauté
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card 
            isPressable 
            onPress={() => openComments(post)}
            key={post.id} 
            className="border-none bg-default-50 hover:bg-default-100 transition-all shadow-sm"
          >
            <CardHeader className="flex flex-col items-start gap-1 p-5">
              <p className="text-md font-bold text-secondary line-clamp-1 italic uppercase">
                {post.title}
              </p>
              <p className="text-[11px] text-default-400 font-medium">
                Par : <span className="font-bold text-primary italic">{authors[post.userId]}</span>
              </p>
            </CardHeader>
            <Divider />
            <CardBody className="py-5 px-5 h-[120px] flex items-center">
              <p className="text-default-600 text-sm line-clamp-3 italic leading-relaxed">
                "{post.body}"
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between items-center px-5 py-3 bg-default-100/50">
              <div className="flex gap-4">
                <span className="text-xs font-black">👍 {post.reactions?.likes}</span>
                <span className="text-xs font-black">👎 {post.reactions?.dislikes}</span>
              </div>
              <p className="text-[10px] font-black text-primary uppercase italic tracking-tighter">
                Voir les avis →
              </p>
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
        classNames={{
          base: "bg-background border border-divider",
          header: "border-b-[1px] border-divider",
          footer: "border-t-[1px] border-divider",
        }}
      >
        <ModalContent>
          {() => ( // Suppression de l'argument onClose non utilisé
            <>
              <ModalHeader className="flex flex-col gap-1 pb-4">
                <p className="text-xs text-primary font-bold uppercase tracking-widest">
                  Détails de la publication
                </p>
                <h2 className="text-xl font-black leading-tight italic uppercase tracking-tighter">
                  {selectedPost?.title}
                </h2>
              </ModalHeader>
              <ModalBody className="py-6">
                <CommentSection 
                  comments={comments} 
                  isLoading={loadingComments} 
                  post={selectedPost} 
                  authorName={selectedPost ? authors[selectedPost.userId] : ""} 
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}