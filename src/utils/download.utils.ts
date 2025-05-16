import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import { AxiosHeaders } from 'axios';

/**
 * Interface for download file function parameters
 */
interface DownloadFileParams {
  apiBaseUrl: string;
  fileName: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (uri: string) => void;
  onError?: (error: any) => void;
  authHeader?: string | number | true | string[] | AxiosHeaders;
}

/**
 * Function to download a file from API for Expo applications
 * @param options - Download file options
 * @returns Promise with the URI of the downloaded file or undefined
 */
export const downloadFile = async ({
  apiBaseUrl,
  fileName,
  onProgress = () => {},
  onSuccess = () => {},
  onError = () => {},
  authHeader
}: DownloadFileParams): Promise<string | undefined> => {
  console.log('Starting downloadFile function with:', { apiBaseUrl, fileName });

  try {
    console.log('Starting download process');

    const fileUrl = apiBaseUrl;

    const sanitizedFileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
    const fileUri = FileSystem.documentDirectory + sanitizedFileName;
    console.log('Download parameters:', { fileUrl, fileUri, sanitizedFileName });

    // Create request headers
    const headers: Record<string, string> = {
      authorization: `Bearer ${authHeader}`,
    };
    console.log('Request headers created', { headers: authHeader ? 'Bearer token set' : 'No auth token' });

    // Create and start the download task
    console.log('Creating download resumable task');
    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      fileUri,
      {
        headers: headers
      },
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite * 100;
        const roundedProgress = Math.round(progress);
        onProgress(roundedProgress);

        // Log progress at reasonable intervals to avoid console spam
        if (roundedProgress % 10 === 0) {
          console.log(`Download progress: ${roundedProgress}%`);
        }
      }
    );

    console.log('Starting download...');
    const downloadResult = await downloadResumable.downloadAsync();
    console.log('Download completed:', downloadResult);

    const { uri } = downloadResult || { uri: undefined };

    if (!uri) {
      console.error('Download failed: No URI returned');
      throw new Error('Download failed');
    }

    console.log('Download success, file saved at:', uri);

    // Save or share the file depending on platform
    if (Platform.OS === 'android') {
      console.log('Platform: Android - handling file access');
      try {
        // Use direct sharing on Android since Media Library may cause issues
        if (await Sharing.isAvailableAsync()) {
          console.log('Sharing is available on Android, using direct sharing');
          const mimeType = getMimeType(fileName);
          await Sharing.shareAsync(uri, {
            mimeType: mimeType,
            dialogTitle: `Open or save the file "${fileName}"`
          });
          console.log('File shared successfully on Android');
        } else {
          console.log('Sharing not available, informing user about file location');
          Alert.alert(
            'Download Successful',
            `The file has been downloaded and saved at: ${uri.split('/').pop()}`
          );
        }
      } catch (sharingError) {
        console.error('Sharing error on Android:', sharingError);
        Alert.alert(
          'Download Successful',
          `The file was downloaded but could not be shared. It is saved at: ${uri}`
        );
      }
    } else {
      console.log('Platform: iOS - initiating sharing');
      const isShareAvailable = await Sharing.isAvailableAsync();
      console.log('Sharing available:', isShareAvailable);

      if (isShareAvailable) {
        const mimeType = getMimeType(fileName);
        console.log('Sharing file with mime type:', mimeType);

        await Sharing.shareAsync(uri, {
          UTI: '.pdf', // Change UTI according to the file type
          mimeType: mimeType
        });
        console.log('File shared successfully on iOS');
      } else {
        console.log('Sharing not available on this device');
        Alert.alert('Download Successful', 'The file was downloaded but cannot be shared on this device');
      }
    }

    console.log('Download process completed successfully');
    onSuccess(uri);
    return uri;
  } catch (error) {
    console.error('Download error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    onError(error);
    Alert.alert('Download Failed', 'Unable to download the file');
    throw error;
  }
};

/**
 * Get MIME type based on file extension
 * @param fileName - File name
 * @returns MIME type string
 */
const getMimeType = (fileName: string): string => {
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeType = (() => {
    switch (fileExt) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
      case 'docx':
        return 'application/msword';
      case 'xls':
      case 'xlsx':
        return 'application/vnd.ms-excel';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  })();

  console.log(`File extension detected: ${fileExt}, MIME type: ${mimeType}`);
  return mimeType;
};
