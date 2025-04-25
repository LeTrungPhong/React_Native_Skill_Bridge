import api from '@/src/api/axios';
import { RootStackParamList } from '@/src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  // Thêm state để hiển thị lỗi
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    name: '',
  });

  const SignUp = () => {
    if (validateForm()) {
      // Xử lý đăng ký khi form hợp lệ
      console.log('Đăng ký với thông tin:', { username, password, confirmPassword, email, phone, name, role });
      
      // Thực hiện đăng ký thực tế ở đây (API call, etc.)
      
      // Thông báo thành công
      Alert.alert(
        "Đăng ký thành công",
        "Tài khoản của bạn đã được tạo.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } else {
      // Hiển thị thông báo lỗi chung
      Alert.alert(
        "Lỗi",
        "Vui lòng kiểm tra lại thông tin đăng ký.",
        [{ text: "OK" }]
      );
    }

    const fetchSignUp = async () => {
      
      // Gọi API đăng ký ở đây
      try {
        const response = await api.post('/register', {
          username,
          password,
          email,
          name,
          phone,
          role
        });
        
        console.log('Registration successful:', response.data);
        
        Alert.alert(
          "Đăng ký thành công",
          "Tài khoản của bạn đã được tạo.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        console.error('Registration error:', error);
        
        Alert.alert(
          "Đăng ký thất bại",
          // error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký.",
          // [{ text: "OK" }]
        );
      }
    }

    fetchSignUp();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      phone: '',
      name: '',
    };

    // Kiểm tra các trường không được để trống
    if (!username.trim()) {
      newErrors.username = 'Username không được để trống';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password không được để trống';
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận password';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = 'Tên không được để trống';
      isValid = false;
    }

    // Kiểm tra password trùng khớp
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Password không khớp';
      isValid = false;
    }

    // Kiểm tra độ dài số điện thoại
    if (phone && phone.length !== 10) {
      newErrors.phone = 'Số điện thoại phải có đúng 10 số';
      isValid = false;
    }

    // Kiểm tra số điện thoại chỉ chứa số
    if (phone && !/^\d+$/.test(phone)) {
      newErrors.phone = 'Số điện thoại chỉ được chứa các chữ số';
      isValid = false;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Hàm để chọn role
  const handleRoleSelect = (selectedRole: 'STUDENT' | 'TEACHER') => {
    setRole(selectedRole);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>SIGN UP</Text>
        
        <TextInput
          style={styles.input}
          placeholder='Username'
          value={username}
          onChangeText={setUsername}
          autoCapitalize='none'
        />
        
        <TextInput
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder='Confirm password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder='Name'
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder='Phone'
          value={phone}
          onChangeText={setPhone} 
        />

        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
        />

        {/* Phần chọn Role */}
        <View style={styles.roleSection}>
          <View style={styles.roleOptions}>
            <TouchableOpacity 
              style={[
                styles.roleButton, 
                role === 'STUDENT' && styles.roleButtonActive
              ]}
              onPress={() => handleRoleSelect('STUDENT')}
            >
              <Text 
                style={[
                  styles.roleButtonText, 
                  role === 'STUDENT' && styles.roleButtonTextActive
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.roleButton, 
                role === 'TEACHER' && styles.roleButtonActive
              ]}
              onPress={() => handleRoleSelect('TEACHER')}
            >
              <Text 
                style={[
                  styles.roleButtonText, 
                  role === 'TEACHER' && styles.roleButtonTextActive
                ]}
              >
                Teacher
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={SignUp}
        >
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  cancelButton: {
    paddingVertical: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  // Styles cho phần chọn role
  roleSection: {
    marginBottom: 15,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#757575',
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  roleButtonActive: {
    backgroundColor: '#5E5CFF',
    borderColor: '#5E5CFF',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#757575',
  },
  roleButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#5E5CFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
  },
});

export default SignUpScreen;