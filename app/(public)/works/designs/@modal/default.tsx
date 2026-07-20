// Required by Next.js parallel routes: renders when no intercepted
// route matches (i.e. on a normal, non-modal page load) — must
// return null, not be omitted, or the build fails on hard navigation.
export default function Default() {
  return null;
}
