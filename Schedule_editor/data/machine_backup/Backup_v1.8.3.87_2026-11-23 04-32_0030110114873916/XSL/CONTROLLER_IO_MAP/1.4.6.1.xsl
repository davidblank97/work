<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="iomap/position[@index='1']">
		<xsl:choose>
			<xsl:when test="./io[@module='JASPER']/potentiometer">
				<xsl:copy-of select="."/>
			</xsl:when>
			<xsl:otherwise>
				<position index="1">
					<io module="JASPER">
						<potentiometer offset="25" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095" />
						<encoder offset="88" analog_high="24" analog_low="-24" digital_high="65535" digital_low="0"/>
					</io>
				</position>
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