<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/iomap/position[@index='0']">
		<xsl:copy-of select="."/>
		<position index="4">
			<io module="JASPER">
				<potentiometer offset="22" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095" />
			</io>
		</position>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>