export const normalizeString = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

export const fuzzyMatch = (query: string, target: string) => {
  const normalizedQuery = normalizeString(query);
  const normalizedTarget = normalizeString(target);
  
  if (!normalizedQuery) return true;
  
  // Basic inclusion check
  if (normalizedTarget.includes(normalizedQuery)) return true;
  
  // Check for each word in query
  const queryWords = normalizedQuery.split(/\s+/);
  return queryWords.every(word => normalizedTarget.includes(word));
};

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  url: string;
  image?: string;
}

export const globalSearch = (query: string, data: any[]): SearchResult[] => {
  if (!query) return [];
  
  return data.filter(item => {
    const titleMatch = fuzzyMatch(query, item.title || item.name || "");
    const subMatch = fuzzyMatch(query, item.subtitle || item.sub || "");
    const descMatch = fuzzyMatch(query, item.description || item.desc || "");
    const tagsMatch = item.tag ? fuzzyMatch(query, item.tag) : false;
    const categoryMatch = item.category ? fuzzyMatch(query, item.category) : false;
    
    return titleMatch || subMatch || descMatch || tagsMatch || categoryMatch;
  }).map(item => ({
    id: item.id || item.name,
    title: item.title || item.name,
    subtitle: item.subtitle || item.sub || item.description?.substring(0, 50) + "...",
    category: item.category || "General",
    url: item.url || `/${item.category || 'destinos'}/${(item.id || item.title || item.name).toLowerCase().replace(/\s+/g, '-')}`,
    image: item.imageUrl || item.img || item.image
  }));
};
