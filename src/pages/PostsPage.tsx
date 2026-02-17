import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Chip, Spinner } from "@heroui/react";
import type { Post } from "../components/AuthContext";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 justify-center items-center">
        <Spinner size="lg" label="Chargement des articles..." color="primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">Flux de Publications</h1>
        <p className="text-default-500 italic">Découvrez les dernières actualités de la communauté.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-none bg-default-50 hover:bg-default-100 transition-colors" shadow="sm">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-bold text-primary capitalize leading-tight">
                  {post.title.substring(0, 30)}...
                </p>
                <p className="text-xs text-default-400">Post #{post.id}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="py-4">
              <p className="text-default-600 text-sm leading-relaxed">
                {post.body}
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between items-center">
              <Chip size="sm" variant="flat" color="secondary">
                User ID: {post.userId}
              </Chip>
              <span className="text-xs text-default-400">5 min lecture</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}