export function isServerSide() {
  return typeof window === 'undefined';
}
