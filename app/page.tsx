'use client';

import { useEffect } from 'react';
import { Logo } from '@/components/common/Logo';
import { Orbitron } from 'next/font/google';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { FaMousePointer } from 'react-icons/fa';
import Link from 'next/link';
import SVG from '@/components/composed/SVG';
import styled from 'styled-components';
import { PATHNAME } from '@/configurations/pathnames';

const orbitron = Orbitron({ subsets: ['latin'] });

async function applyEffectOnScroll(
  targetElement: HTMLElement,
  effectFn: (isInMiddle: number, targetElement: HTMLElement) => void,
  settings?: { bottomOffset?: number }
) {
  async function onScroll() {
    const rect = targetElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const start = viewportHeight - (settings?.bottomOffset || 1); // bottom of screen minus something (custom)
    const end = viewportHeight / 2 - (settings?.bottomOffset || 1); // center of screen

    // Element is fully below the viewport or already past center
    if (rect.top > start || rect.top < end) {
      const progress = rect.top <= end ? 1 : 0;
      effectFn(progress, targetElement);
      return;
    }

    // Calculate progress: top of element moves from bottom to center
    const progress = 1 - (rect.top - end) / (start - end);

    effectFn(progress, targetElement);
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  onScroll();
}

export default function MainPage() {
  useEffect(() => {
    const isMobile = window?.innerWidth < 1050;

    document.querySelectorAll('.illustration').forEach((htmlElement, index) =>
      applyEffectOnScroll(
        htmlElement as HTMLElement,
        (progress, element) => {
          if (!isMobile) {
            const isEven = index % 2 === 0;
            const transforms = `translateY(${
              100 * progress * 2 - 100 * 2
            }px) skew(${isEven ? '-' : ''}${10 * progress}deg, 0deg)`;
            element.style.transform = transforms;
          }

          element.style.opacity = `${progress}`;
        },
        {
          bottomOffset: isMobile ? 1 : 500,
        }
      )
    );

    document.querySelectorAll('li').forEach((htmlElement, index) =>
      applyEffectOnScroll(htmlElement as HTMLElement, (progress, element) => {
        element.style.transform = `translateY(${100 * progress}px)`;
        element.style.opacity = `${progress}`;
      })
    );
  }, []);

  return (
    <StyledDiv>
      <section id="hero">
        <div className="logo">
          <Logo.Symbol width={200} />
          <Logo.Lettering />
        </div>

        <h1 className={orbitron.className}>Open-source Password Manager</h1>
        <h3>
          Own Your Secrets
          <br />
          End-to-End Encrypted, Self-Hosted, Zero-Knowledge.
        </h3>

        <div className="cta">
          <Link href={PATHNAME.app}>
            <button className="border-animate">
              <FaMousePointer />
              Try demo
            </button>
          </Link>

          <Link
            href={'https://github.com/JoaoGeraldes/ninjalynx'}
            target="_blank"
          >
            <button className="border-animate">
              <FaGithub />
              Repository
              <FaExternalLinkAlt
                size="0.6rem"
                style={{ marginBottom: '6px' }}
              />
            </button>
          </Link>
        </div>
      </section>

      <section id="description">
        <div className="double-sided">
          <div className="illustration">
            <SVG.App />
          </div>

          <div className="info">
            <ul>
              <li>
                <h3>Client-side encryption by default</h3>
                All encryption and decryption occur{' '}
                <em>entirely in your browser</em>. Plaintext secrets are never
                sent or stored.
              </li>

              <li>
                <h3>Zero-Knowledge architecture</h3>
                Your master password is never stored, not even as a hash. Only{' '}
                you can decrypt your data, locally.
              </li>

              <li>
                <h3>Self-hosted & open source</h3>
                Deploy it your way.
              </li>

              <li>
                <h3>Minimalist, Functional UI</h3>
                No clutter. No distractions. Just clean, secure, powerful secret
                management.
              </li>

              <li>
                <h3>MongoDB-Powered Storage</h3>
                Lightweight and production-ready using a proven NoSQL database,
                which you own and can configure yourself.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="security">
        <div className="double-sided">
          <div className="illustration">
            <SVG.Encryption />
          </div>

          <div className="info">
            <ul>
              <li>
                <h3>End-to-end encryption</h3>
                using powerful encryption algorithms&nbsp;such as&nbsp;
                <strong>PBKDF2</strong> and <strong>AES-GCM</strong> with
                256-bit for strong, symmetric client-side encryption.
              </li>

              <li>
                <h3>No one owns it, except you.</h3>
                You control where secrets are stored and who has access.
              </li>

              <li>
                <h3>No server-side decryption</h3>
                Everything done on the client.
              </li>

              <li>
                <h3>No third-party crypto libraries</h3>
                Built with native <code>Web Crypto API</code> for security and
                performance.
              </li>

              <li>
                <h3>No backdoors</h3>
                100% open-source. Nothing to hide.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="use-cases">
        <div className="double-sided">
          <div className="illustration">
            <SVG.People />
          </div>

          <div className="info">
            <h1 className={orbitron.className}>
              Built for developers and anyone who loves full control
            </h1>
            <ul>
              <li>
                <h3>Developers</h3>
              </li>

              <li>
                <h3>Tech-Savvy individuals</h3>
              </li>

              <li>
                <h3>
                  Anyone else interested in owning and hosting their own
                  password manager for complete control.
                </h3>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="tech-stack">
        <div className="double-sided">
          <div className="illustration">
            <SVG.TechStack />
          </div>

          <div className="info">
            <h1 className={orbitron.className}>
              Powered by technology you already know and love
            </h1>
            <ul>
              <li>
                <h3>Encryption</h3>
                Web Crypto API
              </li>

              <li>
                <h3>Frontend</h3>
                Next.js (App Router)
              </li>

              <li>
                <h3>Backend</h3>
                Next.js API (App Router)
              </li>

              <li>
                <h3>Database</h3>
                MongoDB
              </li>

              <li>
                <h3>Cryptography</h3>
                Built entirely with native <code>Web Crypto API</code>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="footer-cta">
        <h1>Take back your privacy</h1>
        <p>
          Deploy your own encrypted password manager today. It&apos;s easy,
          fast, and 100% yours.
        </p>
        <p>
          <Link href={'https://github.com/JoaoGeraldes/ninjalynx'}>
            <button className="border-animate">
              <FaGithub />
              Get started
              <FaExternalLinkAlt
                size="0.6rem"
                style={{ marginBottom: '6px' }}
              />
            </button>
          </Link>
        </p>
      </section>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  font-size: 16px;

  * {
    position: relative;
  }

  overflow-x: hidden;
  gap: 4rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #4e2f88;
  color: white;

  li {
    transform: translateY(-100px);
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-size: 2.5em;
    font-weight: bold;
    text-align: center;
  }

  h3 {
    font-size: 1.7em;
    text-align: center;
    font-weight: 300;
  }

  button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.3rem;
    border: 1px solid black;
    width: fit-content;
    padding: 1rem 2rem;
    background: white;
    color: black;
    opacity: 0.8;
    box-shadow: 1px 1px 10px 1px #000000ab;
    border-radius: 4px;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }
  }

  section:nth-child(odd) {
    .double-sided {
      flex-direction: row;
    }
  }

  section {
    border-radius: 4em 4em 0em 0em;
    min-height: 100vh;
    width: 100%;
    gap: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4em;
    margin-bottom: 2em;

    ul {
      display: flex;
      flex-direction: column;
      gap: 4rem;
    }
  }

  .logo {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  #hero {
    background: linear-gradient(#4e2f88, #090c1700);

    h1 {
      text-align: center;
    }

    .cta {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
  }

  #description {
    background: linear-gradient(#090c17, #4e2f88);
    width: 100%;

    .cta {
      display: flex;
      flex-direction: row;
    }
  }

  #security {
    background: linear-gradient(#090c17, #4e2f88);
  }

  #use-cases {
    background: linear-gradient(#090c17, #4e2f88);
  }

  #tech-stack {
    background: linear-gradient(#090c17, #4e2f88);
  }

  #footer-cta {
    background: linear-gradient(#4e2f88, #090c17);
    margin: 0;
  }

  .border-animate {
    transition: color 0.2s;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 4px;
      background: #5500ff;
      transition: width 0.15s ease-in-out;
    }

    &:hover {
      color: black;

      &::before {
        width: 100%;
      }
    }
  }

  .double-sided {
    display: flex;
    flex-direction: row-reverse;
    max-width: 1424px;
    /* padding: 4rem; */
    text-shadow: 1px 1px 2px #090c179c;
    min-height: 100vh;
    height: max-content;
    width: 100%;
    gap: 4em;

    .info {
      max-width: 50%;
    }

    .illustration {
      width: 100%;
      max-width: 50%;
      display: flex;
      align-items: center;
    }

    h3 {
      text-align: left;
    }
  }

  @keyframes animation-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes animation-shimmer {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  @media (max-width: 1049px) {
    font-size: 14px;

    .logo {
      width: 100px;
    }

    section {
      padding: 1em;

      ul {
        width: 100%;
        gap: 3em;
        /* padding: 2em; */
      }
    }

    section:nth-child(odd) .double-sided {
      flex-direction: column;
    }

    .double-sided {
      flex-direction: column;
      padding: 1em;
      align-items: center;
      .illustration {
        max-width: 100%;
        width: 100%;

        svg {
          width: 100%;
        }
      }
      .info {
        width: 100%;
        max-width: initial;
        ul {
          width: 100%;
        }
      }
    }
  }
`;
