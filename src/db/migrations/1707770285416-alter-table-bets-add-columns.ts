import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTableBetsAddColumns1707770285416
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'bets',
      new TableColumn({
        name: 'start_date',
        type: 'timestamp',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'bets',
      new TableColumn({
        name: 'index',
        type: 'int',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bets', 'start_date');
    await queryRunner.dropColumn('bets', 'index');
  }
}
