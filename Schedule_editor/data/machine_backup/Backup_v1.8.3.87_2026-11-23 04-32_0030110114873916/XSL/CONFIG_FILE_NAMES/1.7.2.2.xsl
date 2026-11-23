<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/files[@system='GT7']/io">
		<xsl:choose>
			<xsl:when test="translate(., 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')='CONTROLLER_IO_MAP_SERVO_REV_6.XML'">
				<io>CONTROLLER_IO_MAP_SERVO_REV_2.XML</io>
			</xsl:when>
			<xsl:when test="translate(., 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')='CONTROLLER_IO_MAP_STD_SERVO_REV_6.XML'">
				<io>CONTROLLER_IO_MAP_STD_SERVO_REV_2.XML</io>
			</xsl:when>
			<xsl:when test="translate(., 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')='CONTROLLER_IO_MAP.XML'">
				<io></io>
			</xsl:when>
			<xsl:when test="translate(., 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')='CONTROLLER_IO_MAP_STD.XML'">
				<io></io>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>