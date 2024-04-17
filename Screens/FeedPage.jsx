import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, Keyboard, RefreshControl } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';


const FeedPage = () => {
  const [commentText, setCommentText] = useState('');
  const [openCommentPostId, setOpenCommentPostId] = useState(null); // Track the post ID for open comment box
  const [comments, setComments] = useState({}); 
  const [expandedComments, setExpandedComments] = useState([]); // Track expanded comments
  const [showAllComments, setShowAllComments] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    fetchPosts();
    loadComments();
  }, []);

  useEffect(() => {
    saveComments();
  }, [comments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://10.0.0.10:5001/api/post/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      console.log(`Liked post ${postId}`);
      // Here you can make a request to your backend API to handle the like action for the specific post
      await axios.post(`http://10.0.0.10:5001/api/post/posts/${postId}/like`);
      // You might want to update the state or perform any other action upon successful like
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = (_id) => {
    setOpenCommentPostId((prevId) => (prevId !== _id ? _id : null)); // Open or close the clicked post's comment box
    if (openCommentPostId !== _id && openCommentPostId !== null) {
      // If another comment box is open and it's not the clicked post's comment box, close it
      Keyboard.dismiss(); // Dismiss the keyboard if open
    }
  };

  const handlePostComment = async (postId) => { // Change parameter name to postId
    try {
      const postComments = comments[postId] || []; // Use postId instead of item._id
      const updatedComments = [...postComments, commentText];
      setComments({ ...comments, [postId]: updatedComments }); // Use postId instead of item._id
  
      setCommentText('');
      setOpenCommentPostId(null);
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

// Function toggeles whether the comments are expanded or not
  const toggleComments = (_id) => {
    if (expandedComments.includes(_id)) {
      setExpandedComments((prev) => prev.filter((id) => id !== _id));
      setShowAllComments(false); // Collapse comments and set showAllComments to false
    } else {
      setExpandedComments((prev) => [...prev, _id]);
      setShowAllComments(true); // Expand comments and set showAllComments to true
    }
  };

const renderPost = ({ item }) => {
  return (
    <View style={styles.postContainer}>
      <Text style={styles.username}>@{item.username}</Text>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').width / 1.6}
          autoPlay={false}
          // image
          data={item.mediaFile.map(uploads => ({ uri: `http://10.0.0.10:5001/uploads/${uploads}` }))} // Construct image URIs
          scrollAnimationDuration={800}
          gestureActiveMultiplier={10} // Adjust this value (default is 1)
          gestureVelocityImpact={0.1} // Adjust this value (default is 0.1)
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          renderItem={({ item: image }) => (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Image source={{ uri: image.uri }} style={styles.postImage} />
            </View>
          )}
        />
      </View>
      <Text style={styles.description}>Location: {item.title}</Text>
      <Text style={styles.description}>Description: {item.content}</Text>
      {/* Render comments */}
      {comments[item._id]?.slice(0, showAllComments || expandedComments.includes(item._id) ? undefined : 2).map((comment, index) => (
        <Text key={index} style={styles.commentText}>
          {comment}
        </Text>
      ))}
      {/* Render the expand/shrink icon */}
      {comments[item._id]?.length > 2 && (
        <TouchableOpacity onPress={() => toggleComments(item._id)}>
          <Icon name={expandedComments.includes(item.id) ? "up" : "down"} style={styles.buttonIcon} />
        </TouchableOpacity>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Icon name="like1" style={styles.buttonIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(item._id)}>
          <Icon name="message1" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
      {openCommentPostId === item._id && (
  <View style={styles.commentContainer}>
    <TextInput
      style={styles.commentInput}
      placeholder="Write a comment..."
      value={commentText}
      onChangeText={setCommentText}
    />
    <TouchableOpacity onPress={() => handlePostComment(item._id)}>
      <Text style={styles.postCommentButton}>Post</Text>
    </TouchableOpacity>
  </View>
)}

    </View>
  );
};

return (
  <View>
    <FlatList
      data={posts}
      keyExtractor={(item) => (item && item._id ? item._id.toString() : Math.random().toString())}
      renderItem={renderPost}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      // data={posts}
      // keyExtractor={(item) => item.postId}
      // renderItem={renderPost}
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