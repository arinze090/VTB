import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';

import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import HeaderTitle from '../../components/common/HeaderTitle';
import FormInput from '../../components/form/FormInput';
import ScrollViewSpace from '../../components/common/ScrollViewSpace';
import FixedBottomContainer from '../../components/common/FixedBottomContainer';
import FormButton from '../../components/form/FormButton';
import {windowWidth} from '../../utils/Dimensions';
import {checkUserProfile} from '../../services/userServices';
import axiosInstance from '../../utils/api-client';
import {RNToast} from '../../Library/Common';
import {getUser, signOut} from '../../redux/features/user/userSlice';

const ProfileInformation = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const loggedInUserRole = state?.user?.userRole;
  console.log('loggedInUserRole', loggedInUserRole);

  const userProfle = state?.user?.user;
  console.log('userProfle', userProfle);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(
    userProfle?.User?.email ? userProfle?.User?.email : '',
  );
  const [fullName, setFullName] = useState(
    userProfle?.fullname ? userProfle?.fullname : '',
  );
  const [phoneNumber, setPhoneNumber] = useState(
    userProfle?.User?.phoneNumber ? userProfle?.User?.phoneNumber : '',
  );
  const [country, setCountry] = useState(
    userProfle?.country ? userProfle?.country : '',
  );
  const [city, setCity] = useState(userProfle?.city ? userProfle?.city : '');
  const [address, setAddress] = useState(
    userProfle?.address ? userProfle?.address : '',
  );

  // Error states
  const [formError, setFormError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [cityError, setCityError] = useState('');

  const updateProfile = async () => {
    const updateProfileData = {
      fullname: fullName,
      // phone_number: phoneNumber,
      city: city,
      address: address,
      // country: userProfle?.country,
    };

    console.log('updateProfileData', updateProfileData);

    if (!fullName) {
      setFullNameError('Please provide your fullname');
    // } else if (!phoneNumber) {
    //   setPhoneNumberError('Please provide your valid phone number');
    } else if (!city) {
      setCityError('Please provide your city');
    } else if (!address) {
      setAddressError('Please provide a valid address');
    } else {
      setLoading(true);
      try {
        await axiosInstance({
          url: 'api/profile/update-profile',
          method: 'PUT',
          data: updateProfileData,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            console.log('res', res?.data);
            setLoading(false);

            if (res?.data) {
              console.log('updateProfile data', res?.data);
              checkUserProfile(dispatch, getUser, axiosInstance);
              RNToast(Toast, 'Great, Your profile has been updated 😇');
              navigation.goBack();
            } else {
              console.log('message', res?.data?.message);
              setFormError(
                'An error occured while updating your profile, please try again later',
              );
            }
          })
          .catch(err => {
            console.log('updateProfile err', err);
            setLoading(false);

            if (err?.status == 401) {
              Alert.alert(
                'Session Expired',
                'Your session has expired, please login',
              );
              dispatch(signOut());
              navigation.navigate('Login');
              setFormError('Your session has expired. Please log in again.');
            } else {
              setFormError(
                'An error occured while updating your profile, please try again later',
              );
            }
          });
      } catch (error) {
        console.log('updateProfile error', error);
        setFormError(
          'An error occured while updating your profile, please try again later',
        );
      }
    }
  };

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        leftIcon={'arrow-back-outline'}
        onLeftIconPress={() => {
          navigation.goBack();
        }}
        headerTitle={'Profile Information'}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop: 0}}>
        <View style={styles.profileImageSection}>
          <Image
            source={require('../../assets/user-dummy-img.jpg')}
            style={styles.profileImage}
          />
        </View>
        <FormInput
          formInputTitle={'Full Name'}
          placeholder=""
          keyboardType={'default'}
          editable={false}
          value={fullName}
          width={1.1}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={txt => {
            setFullName(txt);
            setFormError('');
            setFullNameError('');
          }}
          errorMessage={fullNameError}
        />
        <FormInput
          formInputTitle={'Email Address'}
          placeholder=""
          keyboardType={'email-address'}
          editable={false}
          value={email}
          width={1.1}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={txt => {
            setEmail(txt);
            setFormError('');
          }}
        />
        <FormInput
          formInputTitle={'Phone Number'}
          placeholder="098463525"
          keyboardType={'number-pad'}
          value={phoneNumber}
          width={1.1}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={txt => {
            setPhoneNumber(txt);
            setFormError('');
            setPhoneNumberError('');
          }}
          errorMessage={phoneNumberError}
        />

        <FormInput
          formInputTitle={'City'}
          placeholder=""
          keyboardType={'default'}
          value={city}
          width={1.1}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={txt => {
            setCity(txt);
            setFormError('');
            setCityError('');
          }}
          errorMessage={cityError}
        />
        <FormInput
          formInputTitle={'Country'}
          placeholder="Country"
          keyboardType={'default'}
          editable={false}
          value={country}
          width={1.1}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={txt => {
            setCountry(txt);
            setFormError('');
          }}
        />
        <FormInput
          formInputTitle={'Address'}
          numberOfLines={5}
          multiLine={true}
          keyboardType={'default'}
          height={100}
          placeholder="Enter your address"
          value={address}
          width={1.1}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={txt => {
            setAddress(txt);
            setFormError('');
            setAddressError('');
          }}
          errorMessage={addressError}
        />

        <ScrollViewSpace />
      </ScrollView>

      {/* Buttons */}
      <FixedBottomContainer top={1.2}>
        <FormButton
          title={'Update Profile'}
          width={1.1}
          onPress={updateProfile}
          loading={loading}
          disabled={loading}
          formError={formError}
        />
      </FixedBottomContainer>
    </SafeAreaViewComponent>
  );
};

export default ProfileInformation;

const styles = StyleSheet.create({
  profileImageSection: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  editIcon: {
    bottom: 0,
    position: 'absolute',
    right: windowWidth / 2.5,
  },
});
