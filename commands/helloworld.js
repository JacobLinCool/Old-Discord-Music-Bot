const { SlashCommandBuilder } = require("@discordjs/builders");

const langs = {
    ada: `with TEXT_IO;
procedure HELLO is
begin
 TEXT_IO.PUT_LINE ("Hello, World!");
end HELLO;`,
    bash: `#!/bin/sh  echo "Hello, World!"`,
    c: `#include <stdio.h>
int main(void){
    printf("Hello, world!\\n");
    return 0;
}`,
    "c#": `using System;
class HelloWorld{
	static void Main(){
		System.Console.WriteLine("Hello, World!");
	}
}`,
    "c++": `#include <iostream>
 
int main(){
	std::cout << "Hello, World!\\n";
}`,
    dart: `main() {
  print('Hello World!');
}`,
    go: `package main
 
import "fmt"
 
func main() {
	fmt.Println("Hello World")
}`,
    java: `public class HelloWorld
   {
        public static void main(String[] args)
        {
             System.out.println("Hello, world!");
        }
   }`,
    javascript: `console.log("Hello, world!");`,
    kotlin: `fun main(args: Array<String>) {
  val scope = "world"
  println("Hello, $scope!")
}`,
    lua: `print "Hello, World!"`,
    mathematica: `(* Hello World in Mathematica *)
Print["Hello world"]`,
    matlab: `disp('Hello world')`,
    pascal: `program hello;
 
begin
writeln('Hello, World!');
end.`,
    php: `<?php
 echo 'Hello, World!';
?>`,
    python: `print "Hello, World!"`,
    scala: `object HelloWorld with Application {
 Console.println("Hello, World!");
}`,
    sql: `CREATE TABLE message (text char(15));
INSERT INTO message (text) VALUES ('Hello, World!');
SELECT text FROM message;
DROP TABLE message;`,
    swift: `print("hello world")`,
};

const data = new SlashCommandBuilder()
    .setName("helloworld")
    .setDescription("Hello World 範例程式碼")
    .addStringOption((option) => {
        option.setName("語言").setDescription("範例程式碼語言").setRequired(true).addChoice("隨機", "_random");

        for (const key in langs) option.addChoice(key, key);
        return option;
    });

async function run({ client, interaction }) {
    let lang = interaction.options.getString("語言").trim();

    if (lang === "_random") {
        const keys = Object.keys(langs);
        lang = keys[Math.floor(Math.random() * keys.length)];
    }

    if (langs[lang]) await interaction.reply(`**${lang}** Hello World: \n\`\`\`${lang}\n${langs[lang]}\`\`\``);
    else await interaction.reply(`Hello, World!`);
}

module.exports = { data, run };
