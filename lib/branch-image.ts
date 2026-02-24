/**
 * Branch image path: public folder has one .jpg per branch, filename = branch name (lowercase).
 * e.g. theliyagonna.jpg, mallawapitiya.jpg, kurunegala.jpg, paragahadeniya.jpg
 */
export function getBranchImageUrl(branch: { name: string }): string {
  const base = branch.name.trim().replace(/\s+/g, "").toLowerCase();
  return base ? `/${base}.jpg` : "/fn-logo.png";
}
