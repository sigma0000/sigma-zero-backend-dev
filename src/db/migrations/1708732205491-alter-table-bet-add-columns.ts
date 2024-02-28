import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTableBetAddColumns1708732205491
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('bets', [
      new TableColumn({
        name: 'value',
        type: 'decimal',
        isNullable: true,
      }),
      new TableColumn({
        name: 'auxiliary_value',
        type: 'decimal',
        isNullable: true,
      }),
      new TableColumn({
        name: 'option',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bets', 'value');
    await queryRunner.dropColumn('bets', 'auxiliary_value');
    await queryRunner.dropColumn('bets', 'option');
  }
}
