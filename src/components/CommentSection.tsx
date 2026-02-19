import { Spinner, User as UserUI, Divider, Button, Input } from "@heroui/react";
import type { Post } from "../components/AuthContext";

interface Comment {
  id: number;
  body: string;
  user: {
    username: string;
    fullName: string;
  };
}

interface CommentSectionProps {
  comments: Comment[];
  isLoading: boolean;
  post: Post | null; // On récupère le post sélectionné
  authorName: string; // Et le nom de son auteur
}

export const CommentSection = ({ comments, isLoading, post, authorName }: CommentSectionProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="md" label="Chargement de la discussion..." color="primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col gap-8 pb-32">
        
        {/* --- SECTION POST ORIGINAL --- */}
        {post && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <UserUI
              name={<span className="font-black text-sm text-primary uppercase italic">{authorName}</span>}
              description={<span className="text-[10px] text-default-400 font-bold">AUTEUR DE LA PUBLICATION</span>}
              avatarProps={{
                src: `https://i.pravatar.cc/150?u=${post.userId}`,
                className: "w-10 h-10 ring-2 ring-primary/20"
              }}
            />
            <div className="ml-12 bg-primary-50/30 p-5 rounded-2xl border-l-4 border-primary shadow-sm">
              <p className="text-md text-default-800 leading-relaxed font-semibold italic">
                "{post.body}"
              </p>
              <div className="flex gap-4 mt-4 pt-3 border-t border-primary/10">
                <span className="text-xs font-bold text-success">👍 {post.reactions?.likes}</span>
                <span className="text-xs font-bold text-danger">👎 {post.reactions?.dislikes}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 my-2">
                <Divider className="flex-1" />
                <span className="text-[10px] font-black text-default-300 uppercase tracking-widest">Discussion</span>
                <Divider className="flex-1" />
            </div>
          </div>
        )}

        {/* --- LISTE DES COMMENTAIRES --- */}
        {comments.length === 0 ? (
          <p className="text-center text-default-400 py-10 italic text-sm">
            Aucun commentaire pour le moment.
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-2 group">
              <div className="flex justify-between items-center">
                <UserUI
                  name={<span className="font-bold text-sm">{comment.user.fullName || comment.user.username}</span>}
                  description={<span className="text-[10px] text-default-400">@{comment.user.username}</span>}
                  avatarProps={{
                    src: `https://i.pravatar.cc/150?u=${comment.user.username}`,
                    className: "w-8 h-8"
                  }}
                />
                <button className="text-default-300 opacity-0 group-hover:opacity-100 transition-opacity p-1">•••</button>
              </div>

              <div className="ml-10 bg-default-100 p-4 rounded-2xl rounded-tl-none border border-default-200/50 shadow-sm">
                <p className="text-sm text-default-700 leading-relaxed">{comment.body}</p>
                <div className="flex gap-4 mt-3 pt-2 border-t border-default-200/40">
                  <button className="text-[10px] font-black text-default-400 hover:text-primary uppercase tracking-tighter">Répondre</button>
                  <button className="text-[10px] font-black text-default-400 hover:text-success uppercase tracking-tighter">👍 J'aime</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Zone de saisie fixe */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 border-t border-default-200 z-10 -mx-6">
        <div className="flex flex-col gap-2 bg-default-50 rounded-2xl p-2 border-2 border-transparent focus-within:border-primary/10 transition-all">
          <Input
            placeholder="Écrivez votre commentaire..."
            variant="flat"
            fullWidth
            classNames={{ inputWrapper: "bg-transparent shadow-none", input: "text-sm" }}
            endContent={<span className="text-xl cursor-pointer hover:scale-110 transition-transform">😊</span>}
          />
          <div className="flex justify-end pr-1 pb-1">
            <Button color="primary" size="sm" className="font-bold rounded-xl px-6 shadow-lg shadow-primary/20">Envoyer</Button>
          </div>
        </div>
      </div>
    </div>
  );
};