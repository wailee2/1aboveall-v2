/**
 * Declares the @modal parallel-route slot alongside the normal page
 * content. `modal` renders whatever @modal/default.tsx or an
 * intercepted @modal/(.)[slug]/page.tsx currently resolves to — null
 * on the plain grid, the DribbbleModal when a design was opened via
 * soft navigation from the grid.
 */
export default function DesignsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
