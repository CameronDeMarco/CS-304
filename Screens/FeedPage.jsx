import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, Keyboard } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const staticPosts = [
  {
    id: 1,
    username: 'JohnDoe',
    images: [
      { uri: 'https://adventuresofaplusk.com/wp-content/uploads/2022/01/DSC05615-683x1024.jpg' },
      { uri: 'https://media.istockphoto.com/id/1672317574/photo/ama-dablam-mountain-peak.webp?b=1&s=170667a&w=0&k=20&c=Ea8yDEHpUemrRuMZUKGPDBE11YTWVksIupMN8FkEBf8=' },
    ],
    location: 'Mt Willard White Mountains',
    description: 'This is the first post.',
    comments: [],
  },
  {
    id: 2,
    username: 'JaneSmith',
    images: [
      { uri: 'https://www.travel-experience-live.com/wp-content/uploads/2014/07/P6186575-2.jpg?x46828' },
      { uri: 'https://www.travel-experience-live.com/wp-content/uploads/2014/07/P6186575-2.jpg?x46828' },
    ],  
    location: 'Flume',
    description: 'Another post here.',
    comments: [],
  },
  {
    id: 3,
    username: 'Smith',
    images: [
      { uri: 'https://media.istockphoto.com/id/1672317574/photo/ama-dablam-mountain-peak.webp?b=1&s=170667a&w=0&k=20&c=Ea8yDEHpUemrRuMZUKGPDBE11YTWVksIupMN8FkEBf8=' },
      { uri: 'https://www.travel-experience-live.com/wp-content/uploads/2014/07/P6186575-2.jpg?x46828' },
    ],   
    location: 'Mountain',
    description: 'Another post here.',
    comments: [],
  },
];

const FeedPage = () => {
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState({}); 

 useEffect(() => {
  loadComments();
}, []);

useEffect(() => {
  saveComments();
}, [comments]);


  const handleLike = (postId) => {

    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId) => {
    setIsCommenting(true);
  };

  const handlePostComment = async (postId) => {
    try {
      const postComments = comments[postId] || [];
      const updatedComments = [...postComments, commentText];
      setComments({ ...comments, [postId]: updatedComments });

      setCommentText('');
      setIsCommenting(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem('comments');
      if (storedComments !== null) {
        setComments(JSON.parse(storedComments));
      }
    } catch (error) {
      console.error('Error loading comments from AsyncStorage:', error);
    }
  };

  const saveComments = async () => {
    try {
      await AsyncStorage.setItem('comments', JSON.stringify(comments));
    } catch (error) {
      console.error('Error saving comments to AsyncStorage:', error);
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.username}>@{item.username}</Text>
      <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').width / 1.6}
        autoPlay={false}
        data={item.images}
        scrollAnimationDuration={800}
        gestureActiveMultiplier={10} // Adjust this value (default is 1)
        gestureVelocityImpact={0.1} // Adjust this value (default is 0.1)
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        renderItem={({ item: image }) => (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={image} style={styles.postImage} />
          </View>
        )}
      />
    </View>
      <Text style={styles.description}>Location: {item.location}</Text>
      <Text style={styles.description}>Description: {item.description}</Text>
    {/* renders comments */}
      {comments[item.id]?.map((comment, index) => (
        <Text key={index} style={styles.commentText}>
          {comment}
        </Text>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Icon name="like1" style={styles.buttonIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleComment(item.id)}>
          <Icon name="message1" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
      {isCommenting && (
        <View style={styles.commentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Type your comment..."
            value={commentText}
            onChangeText={(text) => setCommentText(text)}
          />
          <TouchableOpacity onPress={() => handlePostComment(item.id)}>
            <Text style={styles.postCommentButton}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
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
    width: '90%',    
    height: 200, 
    marginVertical: 10,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  description: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    marginTop: 5,
  },
  carouselContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: "#CD553B", 
    fontSize: 24, 
    marginTop: 5,
  },
  commentContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  postCommentButton: {
    color: "#CD553B",
    fontWeight: 'bold',
  },
  commentText: {
    marginBottom: 8,
    color: '#333',
  },
});

export default FeedPage;
