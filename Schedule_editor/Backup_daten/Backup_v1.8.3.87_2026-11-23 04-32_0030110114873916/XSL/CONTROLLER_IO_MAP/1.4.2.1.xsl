<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

	<xsl:template match="iomap/position[@index='3']">
		<xsl:choose>
			<xsl:when test="./io[@module='JASPER']">
				<position index="1">
					<io module="JASPER">
						<encoder offset="88" analog_high="24" analog_low="-24" digital_high="65535" digital_low="0"/>
					</io>
				</position>
				<position index="2">
					<io module="JASPER">
						<encoder offset="89" analog_high="24" analog_low="-24" digital_high="65535" digital_low="0"/>
					</io>
				</position>
				<position index="3">
					<io module="JASPER">
						<xsl:apply-templates select="./io[@module='JASPER']/potentiometer" />
						<encoder offset="90" analog_high="24" analog_low="-24" digital_high="65535" digital_low="0"/>
					</io>
				</position>
			</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="iomap/position[@index='0']/io[@module='JASPER']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<encoder offset="89" analog_high="24" analog_low="-24" digital_high="65535" digital_low="0"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="iomap/position[@index='7']"/>
	
	<!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>