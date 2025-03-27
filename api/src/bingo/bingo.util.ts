import slugify from 'slugify';

export function slugifyTitle(title: string) {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: 'en',
  });
}
