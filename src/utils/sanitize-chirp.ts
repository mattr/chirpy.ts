const EXPLETIVES = ["kerfuffle", "sharbert", "fornax"];

export default function sanitizeChirp(text: string): string {
  const tokens = text.split(" ");
  const sanitized = tokens.map((token: string) => {
    if (EXPLETIVES.includes(token.toLowerCase())) {
      return "****";
    } else {
      return token;
    }
  });
  return sanitized.join(" ");
}