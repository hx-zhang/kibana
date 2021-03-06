/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Fragment } from 'react';
import {
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiFormRow,
  EuiSelect,
  EuiSwitch,
  EuiTitle,
} from '@elastic/eui';
import { Repository, S3Repository } from '../../../../../common/types';
import { useAppDependencies } from '../../../index';
import { RepositorySettingsValidation } from '../../../services/validation';
import { textService } from '../../../services/text';

interface Props {
  repository: S3Repository;
  updateRepositorySettings: (
    updatedSettings: Partial<Repository['settings']>,
    replaceSettings?: boolean
  ) => void;
  settingErrors: RepositorySettingsValidation;
}

export const S3Settings: React.FunctionComponent<Props> = ({
  repository,
  updateRepositorySettings,
  settingErrors,
}) => {
  const {
    core: {
      i18n: { FormattedMessage },
    },
  } = useAppDependencies();
  const {
    settings: {
      bucket,
      client,
      basePath,
      compress,
      chunkSize,
      serverSideEncryption,
      bufferSize,
      cannedAcl,
      storageClass,
      maxRestoreBytesPerSec,
      maxSnapshotBytesPerSec,
      readonly,
    },
  } = repository;

  const cannedAclOptions = [
    'private',
    'public-read',
    'public-read-write',
    'authenticated-read',
    'log-delivery-write',
    'bucket-owner-read',
    'bucket-owner-full-control',
  ].map(option => ({
    value: option,
    text: option,
  }));
  const hasErrors: boolean = Boolean(Object.keys(settingErrors).length);

  const storageClassOptions = ['standard', 'reduced_redundancy', 'standard_ia'].map(option => ({
    value: option,
    text: option,
  }));

  return (
    <Fragment>
      {/* Client field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.clientTitle"
                defaultMessage="Client"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.clientDescription"
            defaultMessage="The name of the AWS S3 client."
          />
        }
        idAria="s3RepositoryClientDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.clientLabel"
              defaultMessage="Client"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryClientDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.client)}
          error={settingErrors.client}
        >
          <EuiFieldText
            defaultValue={client || ''}
            fullWidth
            onChange={e => {
              updateRepositorySettings({
                client: e.target.value,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Bucket field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.bucketTitle"
                defaultMessage="Bucket"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.bucketDescription"
            defaultMessage="The name of the AWS S3 bucket to use for snapshots."
          />
        }
        idAria="s3RepositoryBucketDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.bucketLabel"
              defaultMessage="Bucket (required)"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryBucketDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.bucket)}
          error={settingErrors.bucket}
        >
          <EuiFieldText
            defaultValue={bucket || ''}
            fullWidth
            onChange={e => {
              updateRepositorySettings({
                bucket: e.target.value,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Base path field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.basePathTitle"
                defaultMessage="Base path"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.basePathDescription"
            defaultMessage="The bucket path to the repository data."
          />
        }
        idAria="s3RepositoryBasePathDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.basePathLabel"
              defaultMessage="Base path"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryBasePathDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.basePath)}
          error={settingErrors.basePath}
        >
          <EuiFieldText
            defaultValue={basePath || ''}
            fullWidth
            onChange={e => {
              updateRepositorySettings({
                basePath: e.target.value,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Compress field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.compressTitle"
                defaultMessage="Snapshot compression"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.compressDescription"
            defaultMessage="Compresses the index mapping and setting files for snapshots. Data files are not compressed."
          />
        }
        idAria="s3RepositoryCompressDescription"
        fullWidth
      >
        <EuiFormRow
          hasEmptyLabelSpace={true}
          fullWidth
          describedByIds={['s3RepositoryCompressDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.compress)}
          error={settingErrors.compress}
        >
          <EuiSwitch
            label={
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.compressLabel"
                defaultMessage="Compress snapshots"
              />
            }
            checked={!(compress === false)}
            onChange={e => {
              updateRepositorySettings({
                compress: e.target.checked,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Chunk size field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.chunkSizeTitle"
                defaultMessage="Chunk size"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.chunkSizeDescription"
            defaultMessage="Breaks files into smaller units when taking snapshots."
          />
        }
        idAria="s3RepositoryChunkSizeDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.chunkSizeLabel"
              defaultMessage="Chunk size"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryChunkSizeDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.chunkSize)}
          error={settingErrors.chunkSize}
          helpText={textService.getSizeNotationHelpText()}
        >
          <EuiFieldText
            defaultValue={chunkSize || ''}
            fullWidth
            onChange={e => {
              updateRepositorySettings({
                chunkSize: e.target.value,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Server side encryption field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.serverSideEncryptionTitle"
                defaultMessage="Server-side encryption"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.serverSideEncryptionDescription"
            defaultMessage="Encrypts files on the server using AES256 algorithm."
          />
        }
        idAria="s3RepositoryServerSideEncryptionDescription"
        fullWidth
      >
        <EuiFormRow
          hasEmptyLabelSpace={true}
          fullWidth
          describedByIds={['s3RepositoryServerSideEncryptionDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.serverSideEncryption)}
          error={settingErrors.serverSideEncryption}
        >
          <EuiSwitch
            label={
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.serverSideEncryptionLabel"
                defaultMessage="Server-side encryption"
              />
            }
            checked={!!serverSideEncryption}
            onChange={e => {
              updateRepositorySettings({
                serverSideEncryption: e.target.checked,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Buffer size field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.bufferSizeTitle"
                defaultMessage="Buffer size"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.bufferSizeDescription"
            defaultMessage="Beyond this minimum threshold, the S3 repository will use the AWS Multipart Upload API
              to split the chunk into several parts and upload each in its own request."
          />
        }
        idAria="s3RepositoryBufferSizeDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.bufferSizeLabel"
              defaultMessage="Buffer size"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryBufferSizeDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.bufferSize)}
          error={settingErrors.bufferSize}
          helpText={textService.getSizeNotationHelpText()}
        >
          <EuiFieldText
            defaultValue={bufferSize || ''}
            fullWidth
            onChange={e => {
              updateRepositorySettings({
                bufferSize: e.target.value,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Canned ACL field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.cannedAclTitle"
                defaultMessage="Canned ACL"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.cannedAclDescription"
            defaultMessage="The canned ACL to add to new S3 buckets and objects."
          />
        }
        idAria="s3RepositoryCannedAclDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.cannedAclLabel"
              defaultMessage="Canned ACL"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryCannedAclDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.cannedAcl)}
          error={settingErrors.cannedAcl}
        >
          <EuiSelect
            options={cannedAclOptions}
            value={cannedAcl || cannedAclOptions[0].value}
            onChange={e => {
              updateRepositorySettings({
                cannedAcl: e.target.value,
              });
            }}
            fullWidth
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Storage class field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.storageClassTitle"
                defaultMessage="Storage class"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.storageClassDescription"
            defaultMessage="The storage class for new objects in the S3 repository."
          />
        }
        idAria="s3RepositoryStorageClassDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.storageClassLabel"
              defaultMessage="Storage class"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryStorageClassDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.storageClass)}
          error={settingErrors.storageClass}
        >
          <EuiSelect
            options={storageClassOptions}
            value={storageClass || storageClassOptions[0].value}
            onChange={e => {
              updateRepositorySettings({
                storageClass: e.target.value,
              });
            }}
            fullWidth
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Max snapshot bytes field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.maxSnapshotBytesTitle"
                defaultMessage="Max snapshot bytes per second"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.maxSnapshotBytesDescription"
            defaultMessage="The rate for creating snapshots for each node."
          />
        }
        idAria="s3RepositoryMaxSnapshotBytesDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.maxSnapshotBytesLabel"
              defaultMessage="Max snapshot bytes per second"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryMaxSnapshotBytesDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.maxSnapshotBytesPerSec)}
          error={settingErrors.maxSnapshotBytesPerSec}
          helpText={textService.getSizeNotationHelpText()}
        >
          <EuiFieldText
            defaultValue={maxSnapshotBytesPerSec || ''}
            fullWidth
            onChange={e => {
              updateRepositorySettings({
                maxSnapshotBytesPerSec: e.target.value,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Max restore bytes field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.maxRestoreBytesTitle"
                defaultMessage="Max restore bytes per second"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.maxRestoreBytesDescription"
            defaultMessage="The snapshot restore rate for each node."
          />
        }
        idAria="s3RepositoryMaxRestoreBytesDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.snapshotRestore.repositoryForm.typeS3.maxRestoreBytesLabel"
              defaultMessage="Max restore bytes per second"
            />
          }
          fullWidth
          describedByIds={['s3RepositoryMaxRestoreBytesDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.maxRestoreBytesPerSec)}
          error={settingErrors.maxRestoreBytesPerSec}
          helpText={textService.getSizeNotationHelpText()}
        >
          <EuiFieldText
            defaultValue={maxRestoreBytesPerSec || ''}
            fullWidth
            onChange={e => {
              updateRepositorySettings({
                maxRestoreBytesPerSec: e.target.value,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      {/* Readonly field */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.readonlyTitle"
                defaultMessage="Read-only"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.snapshotRestore.repositoryForm.typeS3.readonlyDescription"
            defaultMessage="Only one cluster should have write access to this repository. All other clusters should be read-only."
          />
        }
        idAria="s3RepositoryReadonlyDescription"
        fullWidth
      >
        <EuiFormRow
          hasEmptyLabelSpace={true}
          fullWidth
          describedByIds={['s3RepositoryReadonlyDescription']}
          isInvalid={Boolean(hasErrors && settingErrors.readonly)}
          error={settingErrors.readonly}
        >
          <EuiSwitch
            label={
              <FormattedMessage
                id="xpack.snapshotRestore.repositoryForm.typeS3.readonlyLabel"
                defaultMessage="Read-only repository"
              />
            }
            checked={!!readonly}
            onChange={e => {
              updateRepositorySettings({
                readonly: e.target.checked,
              });
            }}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
    </Fragment>
  );
};
