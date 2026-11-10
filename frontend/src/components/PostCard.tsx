import { Icon } from "@/components/Icon";
import type { Post } from "@/types";

export function PostCard({
  liked,
  onCollaborate,
  onLike,
  onSave,
  post,
  saved,
}: {
  liked: boolean;
  onCollaborate: () => void;
  onLike: () => void;
  onSave: () => void;
  post: Post;
  saved: boolean;
}) {
  return (
    <article className="post-card">
      <div className="post-header">
        <span className="avatar">{post.discipline.charAt(0)}</span>
        <div>
          <strong>{post.author}</strong>
          <span>{post.discipline} · {post.location}</span>
        </div>
        <span className={post.local ? "local-label" : "example-label"}>
          {post.local ? "Sesi ini" : "Jejaring"}
        </span>
      </div>
      <div className="post-content">
        <span className="post-type">{post.type}</span>
        <p>{post.body}</p>
        <div className="tag-list">
          {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      {post.image && (
        <figure className="post-image">
          <img alt={post.imageAlt} src={post.image} />
          <figcaption>Foto: {post.imageCredit}</figcaption>
        </figure>
      )}
      <div className="post-actions">
        <button aria-pressed={liked} onClick={onLike} type="button">
          <Icon name="like" /> {liked ? "Dihargai" : "Apresiasi"}
        </button>
        <button onClick={onCollaborate} type="button">
          <Icon name="comment" /> Tanggapi gagasan
        </button>
        <button aria-pressed={saved} onClick={onSave} type="button">
          <Icon name="bookmark" /> {saved ? "Tersimpan" : "Simpan"}
        </button>
      </div>
    </article>
  );
}
