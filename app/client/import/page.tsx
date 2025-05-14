'use client';

import useAppState from '@/hooks/useAppState';
import { PATHNAME } from '@/configurations/pathnames';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import Warn from '@/components/common/Warn';
import { BiError } from 'react-icons/bi';
import { IoMdWarning } from 'react-icons/io';
import { FaFileImport, FaIdBadge } from 'react-icons/fa6';
import { TbReplaceFilled } from 'react-icons/tb';
import { IoArrowBackSharp } from 'react-icons/io5';
import { importDatabase } from '@/fetchers';
import { theme } from '@/theme/theme';

export default function Import() {
  const [importDatabaseSuccess, setImportDatabaseSuccess] = useState(false);
  const [importDatabaseFailure, setImportDatabaseFailure] = useState<
    string | null
  >(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [filePath, setFilePath] = useState('');

  const router = useRouter();
  const { state, dispatch } = useAppState();

  useEffect(() => {
    if (formData) {
      setShowConfirmation(true);
    }
  }, [formData]);

  useEffect(() => {
    if (!state?.auth) {
      router.push(PATHNAME.app);
    }
  }, [state?.auth, router]);

  async function handleImportDatabase() {
    dispatch({
      type: 'set_loading',
      data: true,
    });

    if (!formData) return;

    const result = await importDatabase(formData);

    dispatch({
      type: 'set_loading',
      data: false,
    });

    if (result?.count && result?.message) {
      dispatch({
        type: 'set_auth',
        data: null,
      });

      setImportDatabaseSuccess(true);
    }

    //@ts-ignore
    if (result?.error) {
      //@ts-ignore
      setImportDatabaseFailure(result?.error);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setFormData(formData);
  }

  if (!state?.auth) {
    return null;
  }

  if (showConfirmation) {
    return (
      <StyledDiv>
        <Warn
          icon={<IoMdWarning />}
          title="Warning"
          color="red"
          message={
            <p>
              Importing a new database will permanently delete and replace your
              existing one.
            </p>
          }
        />

        <strong>Are you sure you want to continue?</strong>

        <div className="confirmation">
          <Button
            $color={({ theme }) => theme.color.b}
            $asText
            onClick={() => {
              setShowConfirmation(false);
              setFilePath('');
            }}
          >
            <IoArrowBackSharp />
            &nbsp;Cancel
          </Button>
          <DeleteButton
            onClick={() => {
              setShowConfirmation(false);
              handleImportDatabase();
            }}
          >
            <TbReplaceFilled />
            &nbsp;Yes, replace
          </DeleteButton>
        </div>
      </StyledDiv>
    );
  }

  console.log('filePath', filePath);

  return (
    <StyledDiv>
      {importDatabaseSuccess && (
        <Warn
          title="Success"
          message={
            <>
              Your database was successfully imported. Please,{' '}
              <strong>sign in</strong> to access your new database.
            </>
          }
          color="green"
          icon={<FaIdBadge />}
        />
      )}
      {importDatabaseFailure && (
        <Warn
          title="Failure"
          message={
            <>
              Something failed while trying to import your database:
              <p>
                <strong>{importDatabaseFailure}</strong>
              </p>
            </>
          }
          color="red"
          icon={<BiError />}
        />
      )}

      <h1>
        <FaFileImport /> Import database
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFilePath(e?.target?.value)}
          required
          name="file"
          type="file"
          accept="application/json"
        />

        <div className="actions">
          {!!filePath?.length && (
            <Button
              $asText
              $color={({ theme }) => theme.color.b}
              type="reset"
              onClick={(e) => {
                setFilePath('');
              }}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={!filePath.length}>
            <FaFileImport />
            &nbsp;Import database
          </Button>
        </div>
      </form>

      <Warn
        icon={<IoMdWarning />}
        title="Warning"
        color="orange"
        message={<p>Please backup your current database before proceeding.</p>}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  margin: 4em 0 1em 0;
  width: 100%;
  gap: 1em;
  background: #0000007e;
  padding: 1em;
  color: white;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;

  h1 {
    gap: 0.5em;
    display: flex;
    font-size: 2em;
    align-items: center;
    justify-content: center;
  }

  .actions {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }

  .confirmation {
    margin-top: 2em;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    max-width: 300px;
  }

  form {
    * {
      cursor: pointer;
    }

    margin: 20px 0 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1em;
  }

  strong {
    font-size: 1.2em;
  }

  input {
    border: 2px dashed #ffffff;
    padding: 1em;
    border-radius: 1em;
    margin: 2em 0 2em 0;
  }

  @media only screen and (max-width: 600px) {
    input {
      font-size: 0.7em;
    }
  }
`;

const DeleteButton = styled(Button)`
  background: ${({ theme }) => theme.color.h};
`;
