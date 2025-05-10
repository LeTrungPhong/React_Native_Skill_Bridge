import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Alert } from 'react-native';

/**
 * Interface for download file function parameters
 */
interface DownloadFileParams {
  classId: string | number;
  assignmentId: string;
  fileName: string;
  apiBaseUrl: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (uri: string) => void;
  onError?: (error: any) => void;
  authHeader?: Record<string, string>;
}

/**
 * Hàm tải xuống file từ API cho ứng dụng Expo
 * @param options - Download file options
 * @returns Promise with the URI of the downloaded file or undefined
 */
export const downloadFile = async ({
  classId,
  assignmentId,
  fileName,
  apiBaseUrl,
  onProgress = () => {},
  onSuccess = () => {},
  onError = () => {},
  authHeader = {}
}: DownloadFileParams): Promise<string | undefined> => {
  try {
    // Request access to Media Library (required for saving files on iOS and Android)
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to grant media library access to save files');
      onError('Permission denied');
      return;
    }

    // Tạo URL đầy đủ
    const fileUrl = `${apiBaseUrl}/${classId}/${assignmentId}/${fileName}`;
    
    // Tạo tên file hợp lệ
    const sanitizedFileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
    
    // Xác định đường dẫn để lưu file tạm thời
    const fileUri = FileSystem.documentDirectory + sanitizedFileName;

    // Tạo header cho request
    const headers: Record<string, string> = {
      ...authHeader
    };

    // Tạo và bắt đầu download task
    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      fileUri,
      {
        headers: headers
      },
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite * 100;
        onProgress(Math.round(progress));
      }
    );

    // Thực hiện tải xuống
    const { uri } = await downloadResumable.downloadAsync() || { uri: undefined };
    
    if (!uri) {
      throw new Error('Download failed');
    }

    // Lưu file vào thư viện phương tiện (cho Android) hoặc chia sẻ (cho iOS)
    if (Platform.OS === 'android') {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      }
      
      Alert.alert('Tải xuống thành công', `File đã được lưu vào thư mục Download`);
    } else {
      // Trên iOS, chúng ta sẽ chia sẻ file để người dùng có thể lưu
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf', // Thay đổi UTI tùy theo loại file
          mimeType: getMimeType(fileName)
        });
      } else {
        Alert.alert('Tải xuống thành công', 'File đã được tải xuống nhưng không thể chia sẻ trên thiết bị này');
      }
    }

    onSuccess(uri);
    return uri;
  } catch (error) {
    console.error('Download error:', error);
    onError(error);
    Alert.alert('Tải xuống thất bại', 'Không thể tải xuống file');
    throw error;
  }
};

/**
 * Hàm xác định MIME type dựa trên tên file
 * @param fileName - Tên file
 * @returns MIME type
 */
const getMimeType = (fileName: string): string => {
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
  
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
};