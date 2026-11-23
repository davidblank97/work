<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/iomap/home_switch[@index='0']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/home_switch[@index='1']"/>
			<xsl:otherwise>
				<home_switch index="1">
					<io module="JASPER">
						<home_switch_input offset="40" bit="0"/>
					</io>
				</home_switch>
				<home_switch index="2">
					<io module="JASPER">
						<home_switch_input offset="40" bit="1"/>
					</io>
				</home_switch>
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