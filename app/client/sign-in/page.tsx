'use client';

import useAppState from '@/hooks/useAppState';
import styled, { useTheme } from 'styled-components';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { setAuthCookie } from '@/utils/utils';
import { Redacted_Script } from 'next/font/google';
import { SiMonkeytie } from 'react-icons/si';
import { useRouter } from 'next/navigation';
import { getAuthentication } from '@/fetchers';
import { PATHNAME } from '@/configurations/pathnames';
import { bubbleNow } from '@/components/common/Bubble';
import { Logo } from '@/components/common/Logo';
import Form from '@/components/common/Form';
import Button from '@/components/common/Button';

const redactedScriptFont = Redacted_Script({
  weight: '400',
  display: 'swap',
  subsets: ['latin'],
});

export default function SignIn() {
  const { dispatch, state } = useAppState();

  const theme = useTheme();

  const [reveal, setReveal] = useState({
    apiKey: false,
    masterKey: false,
  });

  const router = useRouter();

  const masterKeyRef = useRef<HTMLDivElement>(null);
  const apiKeyRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    checkAuth();

    async function checkAuth() {
      const masterKeyInSession = sessionStorage.getItem('plainTextMasterKey');
      if (masterKeyInSession) {
        const authentication = await getAuthentication();

        const isAuthenticated = !!authentication?.authenticated;

        //@ts-ignore
        const error = authentication?.error;

        if (error) {
          bubbleNow({
            message: error,
          });
          return;
        }

        if (isAuthenticated) {
          router.push(PATHNAME.app);
          dispatch({
            type: 'set_auth',
            data: {
              isAuthenticated: isAuthenticated,
              plaintext: {
                masterKey: masterKeyInSession,
              },
            },
          });
        }
      }
    }
  }, []);

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    dispatch({ type: 'set_loading', data: true });

    const apiKeyInPlainText = apiKeyRef?.current?.textContent;
    const masterKeyInPlainText = masterKeyRef?.current?.textContent;

    sessionStorage.setItem(
      'plainTextApiKey',
      apiKeyRef.current?.innerText || ''
    );

    sessionStorage.setItem(
      'plainTextMasterKey',
      masterKeyRef.current?.innerText || ''
    );

    if (
      (apiKeyInPlainText?.length || 0) < 1 ||
      (masterKeyInPlainText?.length || 0) < 1
    ) {
      bubbleNow({
        message: 'Please, fill in missing key(s).',
      });
      return;
    }

    if (typeof apiKeyInPlainText !== 'string') return;
    if (typeof masterKeyInPlainText !== 'string') return;

    await setAuthCookie(apiKeyInPlainText);

    sessionStorage.setItem('plainTextApiKey', apiKeyInPlainText);
    sessionStorage.setItem('plainTextMasterKey', masterKeyInPlainText);

    const authentication = await getAuthentication();

    dispatch({ type: 'set_loading', data: false });

    //@ts-ignore
    const error = authentication?.error;

    if (error) {
      bubbleNow({
        message: error,
        styles: {
          background: theme.color.h,
          color: theme.color.c,
        },
      });
      return;
    }

    dispatch({
      type: 'set_auth',
      data: {
        isAuthenticated: authentication
          ? !!authentication?.authenticated
          : false,
        plaintext: {
          masterKey: masterKeyInPlainText,
        },
      },
    });

    if (!!authentication?.authenticated) {
      router.push(PATHNAME.app);
    }
  }

  return (
    <FormContainer>
      <div className="logo">
        <Logo.Symbol width={80} />
        <Logo.Lettering />
      </div>

      <Form className="auth-form" onSubmit={handleSignIn}>
        <div className="input-row">
          <label htmlFor="api-key">
            <strong>API Key</strong>
            <br />
            <small>To authenticate your connection to backend</small>
          </label>
          <div
            ref={apiKeyRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitButtonRef.current?.click();
                return null;
              }
            }}
            className={`input ${
              !reveal.apiKey && redactedScriptFont.className
            }`}
            id="api-key"
            spellCheck={false}
            suppressContentEditableWarning
            contentEditable="true"
          >
            {sessionStorage.getItem('plainTextApiKey') || ''}
          </div>
          <div className="revealer-button-container">
            <Button
              $asText
              onClick={() => setReveal({ ...reveal, apiKey: !reveal.apiKey })}
              type="button"
              className="revealer"
            >
              {!reveal.apiKey ? (
                <FaRegEye color="black" />
              ) : (
                <FaRegEyeSlash color="black" />
              )}
            </Button>
          </div>
        </div>

        <div className="input-row">
          <label htmlFor="master-key">
            <strong>Master Key</strong>
            <br />
            <small>To unlock (decipher) your secrets</small>
          </label>
          <div
            ref={masterKeyRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitButtonRef.current?.click();
                return null;
              }
            }}
            className={`input ${
              !reveal.masterKey && redactedScriptFont.className
            }`}
            suppressContentEditableWarning
            contentEditable="true"
            id="master-key"
          >
            {sessionStorage.getItem('plainTextMasterKey') || ''}
          </div>
          <div className="revealer-button-container">
            <Button
              $asText
              onClick={() =>
                setReveal({ ...reveal, masterKey: !reveal.masterKey })
              }
              type="button"
              className="revealer"
            >
              {!reveal.masterKey ? (
                <FaRegEye color="black" />
              ) : (
                <FaRegEyeSlash color="black" />
              )}
            </Button>
          </div>
        </div>

        <Button
          disabled={state.loading}
          $width="100%"
          $height="60px"
          ref={submitButtonRef}
          type="submit"
        >
          <SiMonkeytie size="1.5em" />
          &nbsp;
          {state.loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Form>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .auth-form {
    gap: 1em;
    width: auto;
    min-width: 300px;
    max-width: 500px;

    .input-row {
      position: relative;
      width: 100%;

      .revealer-button-container {
        display: flex;
        justify-content: end;
        .revealer {
          right: 0px;
          bottom: 19%;
          position: absolute;
        }
      }

      label {
        color: white;
        small {
          color: #ffffff69;
        }
      }

      .input {
        font-size: 1.5rem;
        border: 1px solid white;
        padding: 1rem 4rem 1rem 1rem;
        background: white;
        word-break: break-word;
        border-radius: 4px;
      }

      .toggle-visibility {
        top: 50%;
        right: 0px;
        position: absolute;
      }
    }
  }
`;
