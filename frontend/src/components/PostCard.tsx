import { FormEvent, useState } from "react";
import { Icon } from "@/components/Icon";
import { api, type Post, type PostComment } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  applyPanel,
  avatar,
  cardNotice,
  eyebrow,
  fieldClass,
  formClass,
  labelClass,
  primaryButton,
  surfaceCard,
  tagItem,
  tagList,
} from "@/lib/ui";

export function PostCard({
  onLike,
  onSave,
  post,
}: {
  onLike: () => void;
  onSave: () => void;
  post: Post;
}) {
  const { requireLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function toggleComments() {
    const next = !open;
    setOpen(next);
    if (!next || comments.length > 0) return;
    setLoading(true);
    setError("");
    try {
      setComments(await api<PostComment[]>(`/posts/${post.id}/comments`));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Tanggapan belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requireLogin()) return;
    const text = body.trim();
    if (!text) return;
    setSending(true);
    setError("");
    try {
      const created = await api<PostComment>(`/posts/${post.id}/comments`, {
        method: "POST",
        body: { body: text },
      });
      setComments((current) => [...current, created]);
      setBody("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Tanggapan belum terkirim.");
    } finally {
      setSending(false);
    }
  }

  return (
    <article className={`${surfaceCard} overflow-hidden`}>
      <div className="flex items-center gap-3 px-5 pt-[18px] pb-3 max-[600px]:px-3.5 max-[600px]:pt-3.5 max-[600px]:pb-2.5">
        <span className={avatar}>{post.discipline.charAt(0)}</span>
        <div className="grid min-w-0 gap-1">
          <strong className="overflow-hidden text-[13px] text-ellipsis whitespace-nowrap">{post.author}</strong>
          <span className="text-[10px] text-muted">{post.discipline} · {post.location}</span>
        </div>
        <span
          className={`ml-auto inline-flex rounded-sm px-2 py-1.5 text-[9px] font-bold text-white ${
            post.isOwn ? "bg-moss" : "bg-ink"
          }`}
        >
          {post.isOwn ? "Karya Anda" : "Jejaring"}
        </span>
      </div>
      {post.image && (
        <figure className="relative m-0 bg-[#d2c8b8]">
          <img alt={post.imageAlt ?? ""} className="max-h-[520px] w-full object-cover saturate-[.82]" src={post.image} />
          {post.imageCredit && (
            <figcaption className="absolute right-2 bottom-2 bg-ink px-[7px] py-[5px] text-[8px] text-white">
              Foto: {post.imageCredit}
            </figcaption>
          )}
        </figure>
      )}
      <div className="px-5 pt-2 pb-[18px] max-[600px]:px-3.5 max-[600px]:pb-3.5">
        <span className={eyebrow}>{post.type}</span>
        <p className="mb-[15px] text-sm leading-[1.72] max-[600px]:text-[13px]">{post.body}</p>
        {post.tags.length > 0 && (
          <div className={tagList}>
            {post.tags.map((tag) => <span className={tagItem} key={tag}>{tag}</span>)}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 border-t border-line px-3 py-[5px] max-[600px]:p-1">
        <button
          aria-pressed={post.liked}
          className="flex min-h-[46px] cursor-pointer flex-row items-center justify-center gap-[7px] rounded-sm border-0 bg-transparent p-2 text-[10px] font-bold text-muted hover:bg-[#eee7db] hover:text-brick aria-[pressed=true]:bg-[#eee7db] aria-[pressed=true]:text-brick max-[600px]:flex-col max-[600px]:gap-1 max-[600px]:text-[8px]"
          onClick={onLike}
          type="button"
        >
          <Icon name="like" /> {post.liked ? "Dihargai" : "Apresiasi"}
        </button>
        <button
          aria-expanded={open}
          className="flex min-h-[46px] cursor-pointer flex-row items-center justify-center gap-[7px] rounded-sm border-0 bg-transparent p-2 text-[10px] font-bold text-muted hover:bg-[#eee7db] hover:text-brick max-[600px]:flex-col max-[600px]:gap-1 max-[600px]:text-[8px]"
          onClick={() => void toggleComments()}
          type="button"
        >
          <Icon name="comment" /> Tanggapi gagasan
        </button>
        <button
          aria-pressed={post.saved}
          className="flex min-h-[46px] cursor-pointer flex-row items-center justify-center gap-[7px] rounded-sm border-0 bg-transparent p-2 text-[10px] font-bold text-muted hover:bg-[#eee7db] hover:text-brick aria-[pressed=true]:bg-[#eee7db] aria-[pressed=true]:text-brick max-[600px]:flex-col max-[600px]:gap-1 max-[600px]:text-[8px]"
          onClick={onSave}
          type="button"
        >
          <Icon name="bookmark" /> {post.saved ? "Tersimpan" : "Simpan"}
        </button>
      </div>
      {open && (
        <div className={applyPanel}>
          {loading && <p className={cardNotice} role="status">Memuat tanggapan...</p>}
          {error && <p className={cardNotice} role="alert">{error}</p>}
          {!loading && comments.length === 0 && !error && (
            <p className={cardNotice}>Belum ada tanggapan. Tulis yang pertama.</p>
          )}
          {comments.map((comment) => (
            <p className={cardNotice} key={comment.id}>
              <strong>{comment.author}: </strong>
              {comment.body}
            </p>
          ))}
          <form className={formClass} onSubmit={(event) => void submitComment(event)}>
            <label className={labelClass}>
              Tanggapan
              <textarea
                className={`${fieldClass} resize-y`}
                maxLength={1000}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Tulis tanggapan terhadap gagasan ini..."
                required
                rows={3}
                value={body}
              />
            </label>
            <button className={primaryButton} disabled={sending} type="submit">
              {sending ? "Mengirim..." : "Kirim tanggapan"}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
