import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import HeaderTitle from '../../components/common/HeaderTitle';
import ScrollViewSpace from '../../components/common/ScrollViewSpace';
import SubscriptionCard from '../../components/cards/SubscriptionCard';
import {subscriptionPlans} from '../../data/dummyData';
import {COLORS} from '../../themes/themes';
import axiosInstance from '../../utils/api-client';
import {getUser} from '../../redux/features/user/userSlice';

const SubscriptionScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user?.profile;
  console.log('userProfle', userProfle);

  const whichSubscriptionPlan = userProfle?.User?.SubType;

  const [loading, setLoading] = useState(false);
  const [userSubscriptionPlans, setUserSubscriptionPlans] = useState();
  const [selectedPlan, setSelectedPlan] = useState(null);
  // console.log('selectedPlan', selectedPlan);

  const handleSelectPlan = plan => {
    setSelectedPlan(plan);
  };

  const getSubscriptionPlans = async () => {
    setLoading(true);
    try {
      await axiosInstance({
        url: 'subplan/subrole',
        method: 'GET',
      })
        .then(res => {
          console.log('getSubscriptionPlans res', res?.data);
          setLoading(false);

          const fetchedPlans = Array.isArray(res?.data?.data?.plans)
            ? res?.data?.data?.plans
            : [];

          console.log('Fetched Plans:', fetchedPlans);

          const updatedPlans = subscriptionPlans?.map(plan => {
            const matchedPlan = fetchedPlans.find(
              fetched => fetched.name === plan.subType,
            );
            return matchedPlan ? {...plan, id: matchedPlan.id} : plan;
          });

          console.log('Updated Subscription Plans:', updatedPlans);
          setUserSubscriptionPlans(updatedPlans);
        })
        .catch(err => {
          console.log('getSubscriptionPlans err', err?.response);
          setLoading(false);
        });
    } catch (error) {
      console.log('getSubscriptionPlans error', error);
    }
  };

  const completeSubscription = async () => {
    setLoading(true);
    try {
      await axiosInstance({
        url: 'subscription',
        method: 'POST',
        data: {
          subscriptionPlanId: selectedPlan?.id,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          console.log('completeSubscription res', res?.data);
          setLoading(false);
          checkUserProfile();
        })
        .catch(err => {
          console.log('completeSubscription err', err);
          setLoading(false);
        });
    } catch (error) {
      console.log('completeSubscription error', error);
    }
  };

  const checkUserProfile = async () => {
    try {
      const profileResponse = await axiosInstance({
        url: 'profile/private',
        method: 'GET',
      });

      if (profileResponse?.data?.data && profileResponse?.data?.data?.profile) {
        dispatch(getUser(profileResponse?.data?.data));
        navigation.goBack();
      }
    } catch (error) {
      console.error('checkUserProfile check error:', error);
    }
  };

  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        leftIcon={'arrow-back-outline'}
        onLeftIconPress={() => {
          navigation.goBack();
        }}
        headerTitle={'Subscription'}
      />
      <Text style={styles.subtitle}>Subscription & Plans</Text>
      <Text style={styles.subdescription}>
        We've got a plan that's perfect for you.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{padding: 10}}>
        {userSubscriptionPlans?.map((cur, i) => {
          const isCurrentPlan = cur.subType === whichSubscriptionPlan;
          const isSelected = cur.subType === selectedPlan?.subType;
          const isDisabled = whichSubscriptionPlan && !isCurrentPlan;

          return (
            <SubscriptionCard
              key={i}
              props={cur}
              borderColor={
                isCurrentPlan || isSelected
                  ? COLORS.rendezvousRed
                  : COLORS.appGrey4
              }
              isSubscribed={isCurrentPlan}
              onSubscriptionPressed={completeSubscription}
              onPress={() => !isDisabled && handleSelectPlan(cur)}
              loading={loading}
              isDisabled={isDisabled}
            />
          );
        })}
        <ScrollViewSpace />
      </ScrollView>
    </SafeAreaViewComponent>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  subdescription: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 10,
  },
});
