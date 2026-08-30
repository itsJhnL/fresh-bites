import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StarIcon from "@mui/icons-material/Star";
import FoodImage from "./FoodImage";
import { toNumber, formatPeso } from "../utils/money";

// Renders both the browse-grid card and the cart-line card (isCartView),
// and both the rich Supabase item shape (description/rating/category/slug)
// and the trimmed favorites/cart item shape — optional fields just don't
// render when absent, rather than needing two separate components.
export default function FoodCard({
  item,
  isCartView = false,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const name = item.name || item.title || "Food Item";
  const quantity = item.quantity || 0;
  const priceValue = typeof item.priceValue === "number" ? item.priceValue : toNumber(item.price);
  const itemTotal = priceValue * quantity;
  const detailsHref = item.slug ? `/Menu/${item.slug}` : null;
  const isUnavailable = item.isAvailable === false;

  const Wrapper = detailsHref ? Link : "div";
  const wrapperProps = detailsHref ? { to: detailsHref } : {};

  return (
    <div className="relative flex h-full flex-col rounded-xl border border-cream-200 bg-cream-50 p-5 shadow-card transition hover:border-terracotta-100">
      <div className="mb-2 flex items-start justify-between gap-2">
        {item.categoryName ? (
          <span className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-semibold text-sage-600">
            {item.categoryName}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => onToggleFavorite(item)}
          className={isFavorite ? "text-terracotta-500" : "text-ink-300 transition hover:text-terracotta-500"}
          aria-label={`Favorite ${name}`}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </button>
      </div>

      <Wrapper {...wrapperProps} className="flex flex-1 flex-col items-center pt-2 text-center">
        <FoodImage
          src={item.imageURL || item.image_url}
          alt={name}
          className="h-40 w-40 rounded-lg object-cover sm:h-44 sm:w-44"
        />
        <h2 className="flex min-h-[56px] items-center pt-3 text-base font-bold text-ink-900 sm:text-lg">{name}</h2>
      </Wrapper>

      {item.customizations?.length > 0 ? (
        <p className="mt-1 text-center text-xs font-medium text-ink-500">
          {item.customizations.map((option) => option.name).join(", ")}
        </p>
      ) : (
        item.description && <p className="mt-1 line-clamp-2 text-center text-sm text-ink-500">{item.description}</p>
      )}

      <div className="mt-2 flex items-center justify-center gap-2">
        <p className="rounded-full bg-terracotta-50 px-3 py-1 text-sm font-bold text-terracotta-500">
          {typeof item.price === "number" ? formatPeso(item.price) : item.price}
        </p>
        {item.rating ? (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-gold-500">
            <StarIcon fontSize="inherit" /> {Number(item.rating).toFixed(1)}
          </span>
        ) : null}
      </div>

      {isUnavailable && <p className="mt-2 text-center text-xs font-semibold text-red-600">Currently unavailable</p>}

      <div className="mt-4 flex flex-col gap-2">
        {detailsHref && (
          <Link
            to={detailsHref}
            className="rounded-lg border border-cream-300 px-4 py-2 text-center text-sm font-semibold text-ink-700 transition hover:border-sage-500 hover:text-sage-600"
          >
            View Details
          </Link>
        )}

        {isCartView ? (
          <div className="space-y-3">
            <p className="rounded-lg bg-cream-100 px-3 py-2 text-sm font-semibold text-ink-700">
              Item Total: {formatPeso(itemTotal)}
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDecrease(item.id)}
                  className="h-8 w-8 rounded-full bg-cream-200 text-lg font-bold text-ink-700 transition hover:bg-cream-300"
                  aria-label={`Decrease ${name}`}
                >
                  -
                </button>
                <span className="min-w-8 text-center text-sm font-bold text-ink-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => onIncrease(item.id)}
                  className="h-8 w-8 rounded-full bg-sage-100 text-lg font-bold text-sage-600 transition hover:bg-sage-100/70"
                  aria-label={`Increase ${name}`}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                aria-label={`Remove ${name} from cart`}
              >
                <DeleteOutlineIcon fontSize="small" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart(item)}
            disabled={isUnavailable}
            className="flex w-full flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-sage-500 px-4 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-sage-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="truncate">{isUnavailable ? "Unavailable" : "Add to Cart"}</span>
            {!isUnavailable && (
              <span className="shrink-0 rounded-md bg-cream-50/20 p-1 text-cream-50">
                <ShoppingCartOutlinedIcon fontSize="small" />
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
