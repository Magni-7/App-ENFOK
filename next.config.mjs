// Toutes les photos de styles sont pour l'instant servies localement
// depuis /public (placeholders). On n'autorise donc aucun domaine d'image
// distant : ça évite d'exposer l'API d'optimisation d'images à des URLs
// externes tant que ce n'est pas nécessaire (voir advisory Next.js sur les
// remotePatterns trop permissifs).
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
