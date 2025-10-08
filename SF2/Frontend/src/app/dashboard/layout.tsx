import Sidebar from '../components/sidebar/Sidebar';
import styles from './dashboard.module.scss';
import { ModalProvider } from '../../provider/compras';
import { Toaster } from 'sonner'; // ✅ import do Sonner

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main className="main-content">
        {children}
        {/* ✅ Adiciona o container do Sonner */}
       <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            style: {
              background: "#fff",
              color: "#000",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              padding: "15px 16px",
              fontWeight: 500,
            },
          }}
        />

      </main>
    </div>
  );
}
