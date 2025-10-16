// react-native-swiper.d.ts
declare module 'react-native-swiper' {
  import { Component } from 'react';
  import { ViewProps, StyleProp, ViewStyle } from 'react-native';

  interface SwiperProps extends ViewProps {
    loop?: boolean;
    showsPagination?: boolean;
    dotStyle?: StyleProp<ViewStyle>;
    activeDotStyle?: StyleProp<ViewStyle>;
    paginationStyle?: StyleProp<ViewStyle>;
    ref?: any;
  }

  export default class Swiper extends Component<SwiperProps> {}
}
