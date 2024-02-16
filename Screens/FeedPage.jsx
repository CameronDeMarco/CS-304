import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const staticPosts = [
  {
    id: 1,
    username: 'JohnDoe',
    images: [
      { uri: 'https://media.istockphoto.com/id/1672317574/photo/ama-dablam-mountain-peak.webp?b=1&s=170667a&w=0&k=20&c=Ea8yDEHpUemrRuMZUKGPDBE11YTWVksIupMN8FkEBf8=' },
      { uri: 'https://media.istockphoto.com/id/1672317574/photo/ama-dablam-mountain-peak.webp?b=1&s=170667a&w=0&k=20&c=Ea8yDEHpUemrRuMZUKGPDBE11YTWVksIupMN8FkEBf8=' },
    ],
    location: 'Mountain',
    description: 'This is the first post.',
  },
  {
    id: 2,
    username: 'JaneSmith',
    images: [
      { uri: 'https://media.istockphoto.com/id/1672317574/photo/ama-dablam-mountain-peak.webp?b=1&s=170667a&w=0&k=20&c=Ea8yDEHpUemrRuMZUKGPDBE11YTWVksIupMN8FkEBf8=' },
      { uri: 'https://example.com/your-image-2.jpg' },
    ],  
    location: 'Mountain',
    description: 'Another post here.',
  },
  {
    id: 3,
    username: 'Smith',
    images: [
      { uri: 'https://media.istockphoto.com/id/1672317574/photo/ama-dablam-mountain-peak.webp?b=1&s=170667a&w=0&k=20&c=Ea8yDEHpUemrRuMZUKGPDBE11YTWVksIupMN8FkEBf8=' },
      { uri: 'https://example.com/your-image-2.jpg' },
    ],   
    location: 'Mountain',
    description: 'Another post here.',
  },
];

const FeedPage = () => {
  const handleLike = (postId) => {
    // Implement your logic for handling likes here
    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId) => {
    // Implement your logic for handling comments here
    console.log(`Commented on post ${postId}`);
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.username}>@{item.username}</Text>
      {/* <Carousel
        data={item.images}
        renderItem={({ item: image }) => <Image source={image} style={styles.postImage} />}
        sliderWidth={400}
        itemWidth={400}
      />       */}
      <Carousel
      loop
      width={Dimensions.get('window').width}
      height={Dimensions.get('window').width / 2}
      autoPlay={false}
      data={item.images}
      scrollAnimationDuration={1000}
      renderItem={({ item: image }) => (
        <View style={{ flex: 1 }}>
          <Image source={image} style={styles.postImage} />
        </View>
      )}
    />
      <Text style={styles.description}>Location: {item.location}</Text>
      <Text style={styles.description}>Description: {item.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Text style={styles.buttonText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleComment(item.id)}>
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={staticPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  description: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: 'blue',
    marginTop: 5,
  },
});

export default FeedPage;
