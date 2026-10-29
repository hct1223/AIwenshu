export function navigateToProfile(
  profileId: string,
  onNavigate?: (id: string) => void,
  onClose?: () => void,
): void {
  onNavigate?.(profileId);
  onClose?.();
}
