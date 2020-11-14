import 'package:flutter/material.dart';

class Recording extends StatefulWidget {
  @override
  _RecordingState createState() => _RecordingState();
}

class _RecordingState extends State<Recording> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.green[800],
        title: Text('Recording page'),
        elevation: 0,
      ),
      body: Container(
        child: Text("Recording page"),
      ),
    );
  }
}
