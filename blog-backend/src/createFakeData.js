import Post from './models/posts';

export default function createFakeData() {
  // 0, 1 ... 39로 이루어진 배열을 생성한 후 포스트 데이터로 변환
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트${i}`,
    body: `
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem facilis sequi architecto. Cupiditate ea quibusdam illo obcaecati facere ab necessitatibus fugiat placeat aut quod vitae hic cum, quaerat non eligendi temporibus, nihil ipsum animi consequatur? Soluta molestias rem hic impedit dolorum. Iste non dolores architecto? Delectus iure magnam dolores et, non libero aliquid quo repudiandae quas sapiente. Quia provident minima repudiandae tempore libero, quidem, veritatis ducimus voluptatem pariatur ut, eaque vitae velit! Voluptas fugiat doloremque reprehenderit accusantium, optio odio nesciunt non necessitatibus tenetur ipsa dolor ad voluptatum aspernatur deleniti consequatur provident. Sit, recusandae reiciendis. Veritatis id animi quae officia qui dignissimos nisi eveniet cupiditate? Cumque, quo ipsum. Eaque quae consectetur laborum repudiandae natus, nisi veritatis quidem labore? Repellendus, alias fuga explicabo fugit non facilis, molestiae sapiente, veritatis ullam provident quidem dolore consectetur tempora necessitatibus facere. Ad accusamus iste, voluptatibus quidem dignissimos eveniet, illum, nesciunt veritatis ut perferendis saepe et dicta libero explicabo. Laborum, porro iure deserunt quaerat quod culpa at repellendus unde debitis quis. Voluptatibus a amet eum nulla praesentium eius, quae sunt quis officia unde voluptatem cumque sapiente assumenda maiores, incidunt, vitae maxime voluptates ipsa. Minima eveniet id sunt, numquam dolor odio in quaerat voluptatibus expedita explicabo sit temporibus!`,
    tags: [`가짜`, `데이터`],
  }));
  Post.insertMany(posts, (err, docs) => {
    console.log(docs);
  });
}
