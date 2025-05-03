import { IDemooAssignment } from '@/src/types';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  Dimensions
} from 'react-native';

// Định nghĩa các interface cần thiết
interface IDemoAssignment {
  id: string;
  title: string;
  content: string;
  deadline: string;
  totalPoints: number;
}

interface IAttachment {
  id: string;
  filename: string;
  fileType: string;
  url: string;
}

interface IStudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  attachments: IAttachment[];
  score?: number;
  feedback?: string;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}, ${day}/${month}/${year}`;
}

interface AssignmentCardProps {
  assignment: IDemooAssignment;
  onSubmit?: (id: string) => void;
}

const GradingAssignmentCard = ({ assignment, onSubmit }: AssignmentCardProps) => {
  // Dữ liệu giả về bài tập
  const demoAssignment: IDemoAssignment = {
    id: 'assignment-001',
    title: 'BÀI TẬP TUẦN 1: GIẢI BÀI TOÁN TỐI ƯU',
    content: 'Hãy giải các bài toán tối ưu sau và trình bày lời giải chi tiết. Bài 1: Tìm giá trị lớn nhất và nhỏ nhất của hàm số f(x) = x³ - 3x² + 2 trên đoạn [-1, 3]. Bài 2: Tìm khoảng cách ngắn nhất từ điểm M(2, 1) đến đường thẳng 2x - y + 3 = 0.',
    deadline: '2025-05-05T23:59:00',
    totalPoints: 10
  };

  // Dữ liệu giả về các bài nộp
  const initialSubmissions: IStudentSubmission[] = [
    {
      id: 'sub-001',
      studentId: 'st-001',
      studentName: 'Nguyễn Văn A',
      submittedAt: '2025-05-04T10:23:45',
      attachments: [
        {
          id: 'att-001',
          filename: 'bai_tap_tuan1_NguyenVanA.pdf',
          fileType: 'application/pdf',
          url: 'https://example.com/files/bai_tap_tuan1_NguyenVanA.pdf'
        }
      ],
      score: 8.5,
      feedback: 'Bài làm tốt, trình bày rõ ràng. Thiếu giải thích ở phần bài 2.'
    },
    {
      id: 'sub-002',
      studentId: 'st-002',
      studentName: 'Trần Thị B',
      submittedAt: '2025-05-03T15:42:10',
      attachments: [
        {
          id: 'att-002',
          filename: 'bai_tap_TranThiB.docx',
          fileType: 'application/docx',
          url: 'https://example.com/files/bai_tap_TranThiB.docx'
        },
        {
          id: 'att-003',
          filename: 'calculations.xlsx',
          fileType: 'application/xlsx',
          url: 'https://example.com/files/calculations.xlsx'
        }
      ],
      score: 9,
      feedback: 'Bài làm đầy đủ, phân tích sâu. Có thể cải thiện cách trình bày công thức.'
    },
    {
      id: 'sub-003',
      studentId: 'st-003',
      studentName: 'Lê Minh C',
      submittedAt: '2025-05-05T22:45:30',
      attachments: [
        {
          id: 'att-004',
          filename: 'bai_tap_LeMinhC.pdf',
          fileType: 'application/pdf',
          url: 'https://example.com/files/bai_tap_LeMinhC.pdf'
        }
      ]
    },
    {
      id: 'sub-004',
      studentId: 'st-004',
      studentName: 'Phạm Hoàng D',
      submittedAt: '2025-05-04T18:30:00',
      attachments: [
        {
          id: 'att-005',
          filename: 'bai_tap_PhamHoangD.pdf',
          fileType: 'application/pdf',
          url: 'https://example.com/files/bai_tap_PhamHoangD.pdf'
        }
      ],
      score: 7,
      feedback: 'Còn nhiều sai sót ở phần tính toán. Cần xem lại cách áp dụng công thức đạo hàm.'
    },
    {
      id: 'sub-005',
      studentId: 'st-005',
      studentName: 'Vũ Thị E',
      submittedAt: '2025-05-05T23:50:12',
      attachments: []
    }
  ];
  
  // Handle submission
  function handleSubmit() {
    if (onSubmit) {
      onSubmit(assignment.id);
    }
  };

  // States cho component
  const [submissions, setSubmissions] = useState<IStudentSubmission[]>(initialSubmissions);
  const [editingSubmission, setEditingSubmission] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<IStudentSubmission | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tempScores, setTempScores] = useState<{[key: string]: string}>({});
  const [tempFeedbacks, setTempFeedbacks] = useState<{[key: string]: string}>({});

  // Khởi tạo giá trị mặc định cho điểm và feedback
  useEffect(() => {
    const initialScores: {[key: string]: string} = {};
    const initialFeedbacks: {[key: string]: string} = {};
    
    submissions.forEach(submission => {
      initialScores[submission.id] = submission.score !== undefined ? submission.score.toString() : '';
      initialFeedbacks[submission.id] = submission.feedback || '';
    });
    
    setTempScores(initialScores);
    setTempFeedbacks(initialFeedbacks);
  }, []);

  // Xử lý khi chấm điểm
  const handleSaveScore = (submissionId: string) => {
    const scoreValue = parseFloat(tempScores[submissionId]);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > demoAssignment.totalPoints) {
      Alert.alert('Lỗi', `Điểm phải là số từ 0 đến ${demoAssignment.totalPoints}`);
      return;
    }
    
    // Cập nhật điểm và nhận xét
    setSubmissions(prevSubmissions => 
      prevSubmissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, score: scoreValue, feedback: tempFeedbacks[submissionId] } 
          : sub
      )
    );
    
    setEditingSubmission(null);
    Alert.alert('Thành công', 'Đã lưu điểm và nhận xét');
  };

  // Xử lý khi xem tệp đính kèm
  const handleViewAttachment = (attachmentUrl: string) => {
    Alert.alert('Mở tệp đính kèm', `Đang mở tệp: ${attachmentUrl}`);
  };

  const renderAttachments = (attachments: IAttachment[]) => {
    return attachments.map((attachment) => (
      <TouchableOpacity 
        key={attachment.id}
        style={styles.attachmentItem}
        onPress={() => handleViewAttachment(attachment.url)}
      >
        <Text style={styles.attachmentIcon}>📎</Text>
        <Text style={styles.attachmentName}>{attachment.filename}</Text>
      </TouchableOpacity>
    ));
  };

  // Xử lý khi nhấn vào một sinh viên trong bảng
  const openSubmissionModal = (submission: IStudentSubmission) => {
    setSelectedSubmission(submission);
    setModalVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingSubmission(null);
  };

  // Renderer cho bảng danh sách các bài nộp
  const renderSubmissionList = () => {
    return (
      <View style={styles.submissionListContainer}>
        {/* Header của bảng */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 0.4 }]}>STT</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Sinh viên</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Thời gian nộp</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Điểm</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Tệp</Text>
        </View>
        
        {/* Các dòng trong bảng */}
        {submissions.map((submission, index) => (
          <TouchableOpacity 
            key={submission.id}
            style={styles.tableRow}
            onPress={() => openSubmissionModal(submission)}
          >
            <Text style={[styles.tableCell, { flex: 0.4 }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>{submission.studentName}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {formatDateTime(submission.submittedAt).split(', ')[0]}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>
              {submission.score !== undefined ? submission.score : '-'}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>
              {submission.attachments.length > 0 ? `${submission.attachments.length} tệp` : 'Không có'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Modal chi tiết bài nộp
  const renderSubmissionModal = () => {
    if (!selectedSubmission) return null;
    
    const isEditing = editingSubmission === selectedSubmission.id;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết bài nộp</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.studentInfoModal}>
                <Text style={styles.studentNameModal}>{selectedSubmission.studentName}</Text>
                <Text style={styles.submissionTimeModal}>
                  Nộp lúc: {formatDateTime(selectedSubmission.submittedAt)}
                </Text>
              </View>
              
              <View style={styles.attachmentsContainer}>
                <Text style={styles.sectionTitle}>Bài làm:</Text>
                {selectedSubmission.attachments.length > 0 ? 
                  renderAttachments(selectedSubmission.attachments) : 
                  <Text style={styles.noAttachment}>Không có tệp đính kèm</Text>
                }
              </View>
              
              <View style={styles.gradingSection}>
                <Text style={styles.sectionTitle}>Chấm điểm:</Text>
                
                {isEditing ? (
                  <View style={styles.editingContainer}>
                    <View style={styles.scoreInputContainer}>
                      <TextInput
                        style={styles.scoreInput}
                        keyboardType="numeric"
                        value={tempScores[selectedSubmission.id]}
                        onChangeText={(text) => setTempScores({...tempScores, [selectedSubmission.id]: text})}
                        placeholder={`0-${demoAssignment.totalPoints}`}
                      />
                      <Text style={styles.maxScore}>/{demoAssignment.totalPoints}</Text>
                    </View>
                    
                    <TextInput
                      style={styles.feedbackInput}
                      multiline
                      numberOfLines={3}
                      value={tempFeedbacks[selectedSubmission.id]}
                      onChangeText={(text) => setTempFeedbacks({...tempFeedbacks, [selectedSubmission.id]: text})}
                      placeholder="Nhập nhận xét..."
                    />
                    
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity 
                        style={[styles.button, styles.saveButton]} 
                        onPress={() => handleSaveScore(selectedSubmission.id)}
                      >
                        <Text style={styles.buttonText}>Lưu</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.button, styles.cancelButton]} 
                        onPress={() => setEditingSubmission(null)}
                      >
                        <Text style={styles.cancelButtonText}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.displayContainer}>
                    <View style={styles.scoreDisplay}>
                      <Text style={styles.scoreText}>
                        {selectedSubmission.score !== undefined ? selectedSubmission.score : '-'}
                      </Text>
                      <Text style={styles.maxScore}>/{demoAssignment.totalPoints}</Text>
                    </View>
                    
                    {selectedSubmission.feedback ? (
                      <Text style={styles.feedbackText}>{selectedSubmission.feedback}</Text>
                    ) : (
                      <Text style={styles.noFeedbackText}>Chưa có nhận xét</Text>
                    )}
                    
                    <TouchableOpacity 
                      style={[styles.button, styles.editButton]} 
                      onPress={() => setEditingSubmission(selectedSubmission.id)}
                    >
                      <Text style={styles.buttonText}>
                        {selectedSubmission.score !== undefined ? 'Chỉnh sửa điểm' : 'Chấm điểm'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Phần hiển thị đề bài */}
        <View style={styles.assignmentSection}>
          <Text style={styles.assignmentTitle}>{demoAssignment.title}</Text>
          <Text style={styles.assignmentDeadline}>Hạn nộp: {formatDateTime(demoAssignment.deadline)}</Text>
          
          <View style={styles.assignmentInstructions}>
            <Text style={styles.instructionTitle}>Nội dung đề bài</Text>
            <Text style={styles.instructionText}>{demoAssignment.content}</Text>
          </View>
          
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>Điểm tối đa: {demoAssignment.totalPoints}</Text>
          </View>
        </View>
        
        {/* Phần hiển thị bảng chấm bài */}
        <View style={styles.gradingTableSection}>
          <Text style={styles.gradingTableTitle}>Bảng danh sách bài nộp ({submissions.length})</Text>
          {renderSubmissionList()}
        </View>
      </ScrollView>
      
      {/* Modal chi tiết bài nộp */}
      {renderSubmissionModal()}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    width: '100%',
    padding: 16,
  },
  // Styles cho phần đề bài
  assignmentSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  assignmentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#202124',
  },
  assignmentDeadline: {
    color: '#5f6368',
    fontSize: 14,
    marginBottom: 16,
  },
  assignmentInstructions: {
    marginBottom: 16,
  },
  instructionTitle: {
    color: '#70757a',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
  },
  instructionText: {
    color: '#202124',
    fontSize: 15,
    lineHeight: 22,
  },
  pointsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  pointsText: {
    color: '#5f6368',
    fontWeight: '500',
  },
  
  // Styles cho phần bảng chấm bài
  gradingTableSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginBottom: 16,
  },
  gradingTableTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#202124',
  },
  
  // Styles cho bảng danh sách
  submissionListContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderCell: {
    fontWeight: '600',
    fontSize: 14,
    color: '#5f6368',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 14,
    color: '#202124',
  },
  
  // Styles cho Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#5f6368',
    fontWeight: '600',
  },
  modalScrollView: {
    padding: 16,
    maxHeight: height * 0.7,
  },
  
  // Styles cho thông tin sinh viên trong modal
  studentInfoModal: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  studentNameModal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  submissionTimeModal: {
    fontSize: 14,
    color: '#5f6368',
  },
  
  // Styles cho phần tệp đính kèm
  attachmentsContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    marginBottom: 8,
  },
  attachmentIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  attachmentName: {
    color: '#1a73e8',
    fontSize: 14,
  },
  noAttachment: {
    fontStyle: 'italic',
    color: '#70757a',
    padding: 8,
  },
  
  // Styles cho phần chấm điểm
  gradingSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#70757a',
    marginBottom: 12,
  },
  editingContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
  },
  scoreInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
  },
  maxScore: {
    marginLeft: 4,
    fontSize: 16,
    color: '#5f6368',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#1a73e8',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  editButton: {
    backgroundColor: '#5E5CFF',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  cancelButtonText: {
    color: '#5f6368',
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Styles cho hiển thị điểm và feedback
  displayContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  feedbackText: {
    color: '#5f6368',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  noFeedbackText: {
    fontStyle: 'italic',
    color: '#70757a',
    marginBottom: 16,
  }
});

export default GradingAssignmentCard;