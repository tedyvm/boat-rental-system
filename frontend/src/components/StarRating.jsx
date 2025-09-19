import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRating({ rating = 0, max = 5, size = 20 }) {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} className="text-warning" />);
    } else if (rating >= i - 0.5) {
      stars.push(
        <FaStarHalfAlt key={i} size={size} className="text-warning" />
      );
    } else {
      stars.push(<FaRegStar key={i} size={size} className="text-warning" />);
    }
  }

  return <div className="d-flex align-items-center">{stars}</div>;
}
