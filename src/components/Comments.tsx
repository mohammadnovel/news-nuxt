"use client";

import { useState } from "react";
import { createComment, deleteComment } from "@/actions/comment";
import { useSession } from "next-auth/react";
import { MessageCircle, Reply, Trash2, Send } from "lucide-react";
import Link from "next/link";

type CommentAuthor = {
  id: string;
  name: string | null;
  email: string;
};

type CommentType = {
  id: string;
  content: string;
  createdAt: Date;
  author: CommentAuthor;
  replies?: CommentType[];
};

type CommentsProps = {
  newsId: string;
  comments: CommentType[];
};

export default function Comments({ newsId, comments: initialComments }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("content", newComment);
    formData.append("newsId", newsId);

    const result = await createComment(formData);
    if (result.success) {
      setNewComment("");
      // Refresh page to show new comment
      window.location.reload();
    } else {
      alert(result.error);
    }
    setSubmitting(false);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || submitting) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("content", replyContent);
    formData.append("newsId", newsId);
    formData.append("parentId", parentId);

    const result = await createComment(formData);
    if (result.success) {
      setReplyContent("");
      setReplyingTo(null);
      // Refresh page to show new reply
      window.location.reload();
    } else {
      alert(result.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const result = await deleteComment(commentId);
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: CommentType; depth?: number }) => {
    const isAuthor = session?.user?.id === comment.author.id;
    const isAdmin = session?.user?.role === "ADMIN";
    const canDelete = isAuthor || isAdmin;

    return (
      <div className={`${depth > 0 ? "ml-8 mt-4" : "mt-6"}`}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {(comment.author.name || comment.author.email).charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900">
                    {comment.author.name || comment.author.email}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
            </div>

            {/* Reply Button */}
            {session && depth < 2 && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>
            )}

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitReply(comment.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim() || submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12 border-t-2 border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {(session.user?.name || session.user?.email || "U").charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-900"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Log in
            </Link>{" "}
            to join the discussion
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        ) : (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
