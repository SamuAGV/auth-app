import type { ReactNode } from "react";
import "./AuthCard.css";

interface AuthCardProps {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  footerText?: string;
  footerLink?: {
    text: string;
    href: string;
  };
}

export default function AuthCard({
  children,
  icon,
  title,
  subtitle,
  footerText,
  footerLink,
}: AuthCardProps) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          {icon && <div className="auth-icon">{icon}</div>}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {children}

        {(footerText || footerLink) && (
          <div className="auth-footer">
            <p>
              {footerText}{" "}
              {footerLink && <a href={footerLink.href}>{footerLink.text}</a>}
            </p>
          </div>
        )}

        <div className="security-note">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7 1L2 3.5V6.5C2 9.85 4.14 12.935 7 13.75C9.86 12.935 12 9.85 12 6.5V3.5L7 1Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 7L6.5 8.5L9 5.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Conexión segura</span>
        </div>
      </div>
    </div>
  );
}
