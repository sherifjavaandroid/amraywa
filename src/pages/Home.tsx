import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ThreeBackground from '../components/ThreeBackground';
import SocialButton from '../components/SocialButton';
import KickIcon from '../components/KickIcon';
import {
  DollarSign,
  Youtube,
  Instagram,
  Facebook,
  Gift,
  Wallet,
  CreditCard,
} from 'lucide-react';

// X (Twitter) Icon
function XIcon({ size = 20, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill={color}
      />
    </svg>
  );
}

// TikTok Icon (not in lucide-react)
function TikTokIcon({ size = 20, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.8 1.54v-3.5a4.85 4.85 0 0 1-1.04-.08z"
        fill={color}
      />
    </svg>
  );
}

// Discord Icon (custom SVG for better match)
function DiscordIcon({ size = 20, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
        fill={color}
      />
    </svg>
  );
}

const socialLinks = [
  { href: 'https://kick.com/amrayman_10', icon: <KickIcon size={20} />, label: 'KICK' },
  { href: 'https://tip.dokan.sa/amrayman10', icon: <DollarSign size={20} />, label: 'DONATION' },
  { href: 'https://streamlabs.com/aywa_10/tip', icon: <Gift size={20} />, label: 'STREAMLABS TIP' },
  { href: 'https://ipn.eg/S/amrayman_10/instapay/5X2vib', icon: <Wallet size={20} />, label: 'INSTAPAY' },
  { href: 'https://telda.app', icon: <CreditCard size={20} />, label: 'TELDA · amrayman10' },
  { href: 'https://www.youtube.com/@aywa_10', icon: <Youtube size={20} />, label: 'YOUTUBE' },
  { href: 'https://www.tiktok.com/@amrayman_10', icon: <TikTokIcon size={20} />, label: 'TIKTOK' },
  { href: 'https://www.instagram.com/amrayman_10', icon: <Instagram size={20} />, label: 'INSTAGRAM' },
  { href: 'https://x.com/amrayman_10', icon: <XIcon size={20} />, label: 'X' },
  { href: 'https://www.facebook.com/aywagdan96/?locale=ar_AR', icon: <Facebook size={20} />, label: 'FACEBOOK' },
  { href: 'https://discord.com/invite/GUYCgxXuf', icon: <DiscordIcon size={20} />, label: 'DISCORD' },
];

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      // Entrance timeline — fromTo() with explicit end values so the final
      // state is guaranteed even under React StrictMode's double-invoke.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(card, { opacity: 0, y: 60, rotateX: -12 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.9 })
        .fromTo('.profile-wrapper', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')
        .fromTo('.name-text', { opacity: 0, y: 30, letterSpacing: '20px' }, { opacity: 1, y: 0, letterSpacing: '6px', duration: 0.7 }, '-=0.3')
        .fromTo('.subtitle-line', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, '-=0.3')
        .fromTo('.email-text', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
        .fromTo('.social-button', { opacity: 0, x: -40 }, { opacity: 1, x: 0, stagger: 0.07, duration: 0.5 }, '-=0.2')
        .fromTo('.footer', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.1');

      // Continuous float on the profile picture
      gsap.to(profileRef.current, {
        y: -8,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // 3D tilt on mouse move
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: px * 10,
          rotateX: -py * 10,
          duration: 0.6,
          ease: 'power2.out',
          transformPerspective: 900,
          transformOrigin: 'center',
        });
      };
      const onLeave = () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' });
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);

      return () => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <ThreeBackground />
      <div className="main-container">
        <div className="card" ref={cardRef}>
          {/* Profile Image */}
          <div className="profile-wrapper" ref={profileRef}>
            <img
              src="/images/profile.jpg"
              alt="Amr Ayman Profile"
              className="profile-image"
            />
          </div>

          {/* Name */}
          <h1 className="name-text">AMR AYMAN</h1>

          {/* Subtitle */}
          <div className="subtitle">
            <p className="subtitle-line">Pro Gamer // Streamer</p>
            <p className="subtitle-line">Content Creator // Live Daily</p>
          </div>

          {/* Email */}
          <p className="email-text">aywagdan96@gmail.com</p>

          {/* Social Links */}
          <div className="links-container">
            {socialLinks.map((link, index) => (
              <SocialButton
                key={index}
                href={link.href}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="footer">
            <p>&copy; 2025 AMR AYMAN. All rights reserved.</p>
            <p>
              Developed By <span className="footer-highlight">SHERLOCK</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
