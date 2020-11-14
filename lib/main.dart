import 'package:flutter/material.dart';
import 'package:tactalk/pages/Home.dart';
import 'package:tactalk/pages/Recording.dart';

void main() => runApp(MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => Home(),
        '/recording': (context) => Recording()
      },
    ));
